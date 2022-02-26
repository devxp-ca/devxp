import {model} from "mongoose";
import {DatabaseModel, generateSchema} from "../types/database";

export abstract class Terraform<Resource> implements DatabaseModel<Resource> {
	id: string;
	name: string;
	type: string;

	constructor(id: string, type: string, name?: string) {
		this.id = id;
		this.type = type;
		this.name = name ?? id;
	}

	toSchema() {
		return generateSchema<Resource>(this as unknown as Resource);
	}
	toModel() {
		return model(this.type, this.toSchema());
	}

	abstract toJSON(): Record<string, any>;
}
