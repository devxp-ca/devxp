import {jsonRoot} from "./util";
import {Resource} from "./resource";
import {AwsRoute} from "../types/terraform";

export interface AwsRouteTable {
	vpc: string;
	routes: AwsRoute[];
}
export class AwsRouteTable
	extends Resource<AwsRouteTable>
	implements AwsRouteTable
{
	constructor(
		id: string,
		vpc: string,
		routes: AwsRoute[] | string,
		name?: string
	) {
		super(id, "AwsRouteTable", false, name);
		this.vpc = vpc;

		if (!Array.isArray(routes)) {
			//If an internet gateway is provided,
			//map it to a global cidr block route
			routes = [
				{
					cidr_block: "0.0.0.0/0",
					gateway_id: `\${aws_internet_gateway.${routes}.id}`
				}
			];
		}
		this.routes = routes;
	}

	//Returns a resource block
	toJSON() {
		return jsonRoot("aws_default_route_table", this.id, {
			default_route_table_id: `\${aws_vpc.${this.vpc}.default_route_table_id}`,
			route: this.routes
		});
	}
}
