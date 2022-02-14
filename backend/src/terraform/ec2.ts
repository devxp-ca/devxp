import {model} from "mongoose";
import {DatabaseModel, generateSchema} from "../types/database";
import {ec2InstanceType, amiType} from "../types/terraform";

export interface Ec2 {
	ami: amiType;
	instance_type: ec2InstanceType;
	id: string;
}
export class Ec2 implements Ec2, DatabaseModel<Ec2> {
	constructor(ami: amiType, instance_type: ec2InstanceType, id: string) {
		this.ami = ami;
		this.instance_type = instance_type;
		this.id = id;
	}

	toSchema() {
		return generateSchema<Ec2>(this);
	}
	toModel() {
		return model("Ec2", this.toSchema());
	}

	toJSON() {
		//TODO: Generalize this as an inherited method
		const resource: any = {};
		resource[this.id] = [
			{
				ami: this.ami,
				instance_type: this.instance_type
			}
		];

		return {
			aws_instance: [resource]
		};
	}
}
