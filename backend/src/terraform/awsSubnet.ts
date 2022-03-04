import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface awsSubnet {
	vpc: string;
	cidr_block: string;
	map_public_ip_on_launch: boolean;
	availability_zone: string;
}

export class awsSubnet extends Resource<awsSubnet> implements awsSubnet {
	constructor(
		vpc: string,
		cidr_block: string,
		map_public_ip_on_launch: boolean,
		id: string,
		availability_zone = "us-west-2",
		autoIam?: boolean,
		name?: string
	) {
		super(id, "awsSubnet", autoIam, name);
		this.vpc = vpc;
		this.cidr_block = cidr_block;
		this.map_public_ip_on_launch = map_public_ip_on_launch;
		this.availability_zone = availability_zone;
	}

	//Returns an array of resource blocks
	toJSON() {
		return [
			jsonRoot("aws_subnet", this.id, {
				vpc: this.vpc,
				cidr_block: this.cidr_block,
				map_public_ip_on_launch: this.map_public_ip_on_launch,
				availability_zone: this.availability_zone
			})
		];
	}
}
