import {model} from "mongoose";
import {DatabaseModel, generateSchema} from "../types/database";

export abstract class Resource<Specific> implements DatabaseModel<Specific> {
	id: string;
	name: string;
	type: string;

	constructor(id: string, type: string, name?: string) {
		this.id = id;
		this.type = type;
		this.name = name ?? id;
	}

	toSchema() {
		return generateSchema<Specific>(this as unknown as Specific);
	}
	toModel() {
		return model(this.type, this.toSchema());
	}

	abstract toJSON(): Record<string, any>;
}
