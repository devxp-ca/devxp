import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface Eip {
	instance: string;
	vpc: boolean;
}
export class Eip extends Resource<Eip> implements Eip {
	constructor(id: string, instance: string, vpc: boolean) {
		super(id, "Eip");
		this.instance = instance;
		this.vpc = vpc;
	}

	//Returns a resource block
	toJSON() {
		return jsonRoot("aws_eip", this.id, {
			instance: `\${aws_instance.${this.instance}.id}`,
			vpc: this.vpc
		});
	}
}