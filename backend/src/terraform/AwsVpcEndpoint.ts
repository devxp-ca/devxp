import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface AwsVpcEndpoint {
	vpc: string;
	service: string;
	security_group_ids: string[];
	vpc_endpoint_type: string;
	route_table: {
		id?: string;
		isDefault: boolean;
	};
	privateDns: boolean;
}
export class AwsVpcEndpoint
	extends Resource<AwsVpcEndpoint>
	implements AwsVpcEndpoint
{
	constructor(
		id: string,
		vpc: string,
		service: string,
		security_group_ids: string[] = [],
		route_table: {
			id?: string;
			isDefault: boolean;
		},
		vpc_endpoint_type = "Gateway",
		privateDns = false
	) {
		super(id, "AwsVpcEndpoint");
		this.vpc = vpc;
		this.service = service;
		this.security_group_ids = security_group_ids ?? [];
		this.vpc_endpoint_type = vpc_endpoint_type;
		this.route_table = route_table;
		this.privateDns = privateDns;
	}

	//Returns a resource block
	toJSON() {
		const internal: Record<string, any> = {
			vpc_id: `\${aws_vpc.${this.vpc}.id}`,
			service_name: this.service,
			vpc_endpoint_type: this.vpc_endpoint_type,
			private_dns_enabled: this.privateDns ?? false
		};

		if (this.security_group_ids && this.security_group_ids.length > 0) {
			internal.security_group_ids = this.security_group_ids.map(
				id => `\${aws_security_group.${id}.id}`
			);
		}

		let json = [jsonRoot("aws_vpc_endpoint", this.id, internal)];

		const tableParent = this.route_table.isDefault
			? "aws_default_route_table"
			: "aws_route_table";
		if (!this.route_table.id) {
			json = [
				...json,
				jsonRoot(tableParent, `${this.id}_route_table`, {
					vpc_id: `\${aws_vpc.${this.vpc}.id}`
				})
			];
			this.route_table.id = `${this.id}_route_table`;
		}

		json = [
			...json,
			jsonRoot(
				"aws_vpc_endpoint_route_table_association",
				`${this.id}_route_association`,
				{
					route_table_id: `\${${tableParent}.${this.route_table.id}.id}`,
					vpc_endpoint_id: `\${aws_vpc_endpoint.${this.id}.id}`
				}
			)
		];

		return json;
	}
}
