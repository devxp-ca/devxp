import {jsonRoot} from "./util";
import {Resource} from "./resource";
import {AwsSubnet} from "./awsSubnet";
import {AwsInternetGateway} from "./AwsInternetGateway";
import {AwsRouteTable} from "./AwsRouteTable";
import {AwsRoute} from "./AwsRoute";
import {awsRegion} from "../types/terraform";
import {Eip} from "./Eip";
import {AwsNatGateway} from "./awsNatGateway";

export interface AwsVpc {
	cidr_block: string;
	private_cidr: string;
	public_cidr: string[];
	privateDns: boolean;
	zones: awsRegion[];
}

export class AwsVpc extends Resource<AwsVpc> implements AwsVpc {
	constructor(
		cidr_block: string,
		private_cidr: string,
		public_cidr: string[],
		id: string,
		zones: awsRegion[] = ["us-west-2a"],
		autoIam?: boolean,
		name?: string,
		privateDns = false
	) {
		super(id, "awsVpc", autoIam, name);
		this.cidr_block = cidr_block;
		this.private_cidr = private_cidr;
		this.public_cidr = public_cidr;
		this.privateDns = privateDns;
		this.zones = zones;
	}

	//Returns an array of resource blocks
	toJSON() {
		const gatewayId = `${this.id}_internetgateway`;
		const publicRouteTableId = `${this.id}_routetable_pub`;
		//const privateRouteTableId = `${this.id}_routetable_priv`;
		const publicSubetId = `${this.id}_subnet_public`;
		//const privateSubnetId = `${this.id}_subnet_private`;

		return [
			//PRIVATE
			/*new AwsSubnet(
				this.id,
				this.private_cidr,
				false,
				privateSubnetId
			).toJSON(),
			new AwsRouteTable(privateRouteTableId, this.id, [], false).toJSON(),
			jsonRoot(
				"aws_route_table_association",
				`${this.id}_subnet_private_assoc`,
				{
					subnet_id: `\${aws_subnet.${privateSubnetId}.id}`,
					route_table_id: `\${aws_route_table.${privateRouteTableId}.id}`
				}
			),*/

			//----------------------------------------------------------------//

			//PUBLIC
			...this.zones.map((zone, i) =>
				new AwsSubnet(
					this.id,
					this.public_cidr[i] ?? this.public_cidr[0],
					true,
					`${publicSubetId}${i}`,
					zone
				).toJSON()
			),
			new AwsInternetGateway(gatewayId, this.id).toJSON(),
			new AwsRouteTable(
				publicRouteTableId,
				this.id,
				[
					{
						cidr_block: "0.0.0.0/0",
						gateway_id: `\${aws_internet_gateway.${gatewayId}.id}`
					}
				],
				false
			).toJSON(),
			new AwsRoute(
				`${this.id}_internet_route`,
				publicRouteTableId,
				"0.0.0.0/0",
				gatewayId
			).toJSON(),
			jsonRoot(
				"aws_route_table_association",
				`${this.id}_subnet_public_assoc`,
				{
					subnet_id: `\${aws_subnet.${publicSubetId}0.id}`,
					route_table_id: `\${aws_route_table.${publicRouteTableId}.id}`
				}
			),

			jsonRoot("aws_vpc", this.id, {
				cidr_block: this.cidr_block,
				enable_dns_support: this.privateDns,
				enable_dns_hostnames: this.privateDns
			})
		].flat();
	}
}
