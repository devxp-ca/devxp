import {jsonRoot} from "./util";
import {Resource} from "./resource";
import {AwsSubnet} from "./awsSubnet";
import {AwsInternetGateway} from "./AwsInternetGateway";

export interface AwsVpc {
	cidr_block: string;
	internet: boolean;
}

export class AwsVpc extends Resource<AwsVpc> implements AwsVpc {
	constructor(
		cidr_block: string,
		internetGateway: boolean,
		id: string,
		autoIam?: boolean,
		name?: string
	) {
		super(id, "awsVpc", autoIam, name);
		this.cidr_block = cidr_block;
		this.internet = internetGateway;
	}

	//Returns an array of resource blocks
	toJSON() {
		let json = [
			new AwsSubnet(
				this.id,
				this.cidr_block,
				false,
				`${this.id}_subnet`
			).toJSON(),
			jsonRoot("aws_vpc", this.id, {
				cidr_block: this.cidr_block
			})
		];
		if (this.internet) {
			json = [
				...json,
				new AwsInternetGateway(
					`${this.id}_internetgateway`,
					this.id
				).toJSON()
			];
		}

		return json;
	}
}
