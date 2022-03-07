import {jsonRoot} from "./util";
import {Resource} from "./resource";
import {AwsRoute} from "../types/terraform";

export interface AwsRouteTable {
	vpc: string;
	routes: AwsRoute[];
	defaultTable: boolean;
}
export class AwsRouteTable
	extends Resource<AwsRouteTable>
	implements AwsRouteTable
{
	constructor(
		id: string,
		vpc: string,
		routes: AwsRoute[],
		defaultTable = false,
		name?: string
	) {
		super(id, "AwsRouteTable", false, name);
		this.vpc = vpc;
		this.routes = routes;
		this.defaultTable = defaultTable;
	}

	//Returns a resource block
	toJSON() {
		const resource = this.defaultTable
			? "aws_default_route_table"
			: "aws_route_table";

		const json: Record<string, any> = {};

		if (this.routes.length > 0) {
			json.route = this.routes;
		}

		if (this.defaultTable) {
			json.default_route_table_id = `\${aws_vpc.${this.vpc}.default_route_table_id}`;
		} else {
			json.vpc_id = `\${aws_vpc.${this.vpc}.id}`;
		}

		return jsonRoot(resource, this.id, json);
	}
}
