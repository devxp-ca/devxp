import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface AwsVpc {
	cidr_block: string;
}

export class AwsVpc extends Resource<AwsVpc> implements AwsVpc {
	constructor(
		cidr_block: string,
		id: string,
		autoIam?: boolean,
		name?: string
	) {
		super(id, "awsVpc", autoIam, name);
		this.cidr_block = cidr_block;
	}

	//Returns an array of resource blocks
	toJSON() {
		return [
			jsonRoot("aws_vpc", this.id, {
				cidr_block: this.cidr_block
			})
		];
	}
}
