import {model} from "mongoose";
import {DatabaseModel, generateSchema} from "../types/database";
import {jsonRoot} from "./util";

export interface Terraform<Resource> {
	id: string;
	name: string;
	type: string;
	toJSON: () => Record<string, any>;
}
export abstract class Terraform<Resource>
	implements Terraform<Resource>, DatabaseModel<Resource>
{
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
}
