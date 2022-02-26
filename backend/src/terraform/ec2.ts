import {ec2InstanceType, amiType} from "../types/terraform";
import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface Ec2 {
	ami: amiType;
	instance_type: ec2InstanceType;
}
export class Ec2 extends Resource<Ec2> implements Ec2 {
	constructor(ami: amiType, instance_type: ec2InstanceType, id: string) {
		super(id, "Ec2");
		this.ami = ami;
		this.instance_type = instance_type;
	}

	toJSON() {
		return jsonRoot("aws_instance", this.id, {
			ami: this.ami,
			instance_type: this.instance_type
		});
	}
}
