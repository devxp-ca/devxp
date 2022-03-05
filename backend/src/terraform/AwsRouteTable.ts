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
		routes: AwsRoute[] = [],
		name?: string
	) {
		super(id, "AwsRouteTable", false, name);
		this.vpc = vpc;
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
