import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface AwsRoute {
	route_table_id: string;
	cidr_block: string;
	gateway_id: string;
}
export class AwsRoute extends Resource<AwsRoute> implements AwsRoute {
	constructor(
		id: string,
		route_table_id: string,
		cidr_block: string,
		gateway_id: string
	) {
		super(id, "AwsRoute", false);
		this.route_table_id = route_table_id;
		this.cidr_block = cidr_block;
		this.gateway_id = gateway_id;
	}

	//Returns a resource block
	toJSON() {
		return jsonRoot("aws_route", this.id, {
			route_table_id: `\${aws_route_table.${this.route_table_id}.id}`,
			destination_cidr_block: this.cidr_block,
			gateway_id: `\${aws_internet_gateway.${this.gateway_id}.id}`
		});
	}
}
