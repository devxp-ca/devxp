import {jsonRoot} from "./util";
import {Resource} from "./resource";
import {AwsSubnet} from "./awsSubnet";
import {AwsInternetGateway} from "./AwsInternetGateway";
import {AwsRouteTable} from "./AwsRouteTable";
import {AwsRoute} from "../types/terraform";

export interface AwsVpc {
	cidr_block: string;
	internet: boolean;
}

export class AwsVpc extends Resource<AwsVpc> implements AwsVpc {
	constructor(
		cidr_block: string,
		internet: boolean,
		id: string,
		autoIam?: boolean,
		name?: string
	) {
		super(id, "awsVpc", autoIam, name);
		this.cidr_block = cidr_block;
		this.internet = internet;
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
			const gatewayId = `${this.id}_internetgateway`;

			json = [
				...json,
				new AwsInternetGateway(gatewayId, this.id).toJSON(),
				new AwsRouteTable(`${this.id}_routetable`, this.id, [
					{
						//cidr_block: this.cidr_block,
						//TODO: ALlow this to be configurable
						//This is the collection of EXTERNAL ips which
						//our INTERNAL resources are allowed to access
						//ex a database should only be able to access an Ec2
						//instance, not the internet
						cidr_block: "0.0.0.0/0",
						gateway_id: `\${aws_internet_gateway.${gatewayId}.id}`
					}
				]).toJSON()
			];
		}

		return json.flat();
	}
}
