import {jsonRoot} from "./util";
import {ResourceWithIam} from "./resource";
import {load_balancer_type} from "../types/terraform";
import {arr} from "../util";
import {Ec2} from "./ec2";

export interface AwsLoadBalancer {
	vpc: string;
	internal: boolean;
	type: load_balancer_type;
	securityGroups: string[];
	subnet: string;
	protocol: string;
	port: number;
	instances: Ec2[];
	enable_http2: boolean;
	enable_deletion_protection: boolean;
}
export class AwsLoadBalancer
	extends ResourceWithIam<AwsLoadBalancer>
	implements AwsLoadBalancer
{
	constructor(
		id: string,

		vpc: string,
		type: load_balancer_type,
		internal: boolean,
		securityGroups: string[] | string,
		subnet: string,
		protocol = "HTTP",
		port = 80,

		instances: Ec2[] = [],

		enable_http2 = false,
		enable_deletion_protection = true,

		autoIam?: boolean,
		name?: string
	) {
		super(id, "AwsLoadBalancer", autoIam, name);

		this.vpc = vpc;
		this.type = type;
		this.internal = internal;
		this.securityGroups = arr(securityGroups);
		this.subnet = subnet;
		this.protocol = protocol;
		this.port = port;
		this.instances = instances;
		this.enable_http2 = enable_http2;
		this.enable_deletion_protection = enable_deletion_protection;
	}

	//Returns a resource block
	toJSON() {
		return [
			jsonRoot("aws_lb", this.id, {
				name: this.name,
				internal: this.internal,
				security_groups: this.securityGroups.map(
					g => `\${aws_security_group.${g}.id}`
				),
				subnets: `\${aws_subnet.${this.subnet}.id}`,
				enable_http2: this.enable_http2,
				enable_deletion_protection: this.enable_deletion_protection
			}),
			jsonRoot("aws_lb_target_group", `${this.id}_target`, {
				name: `${this.id}_target`,
				port: this.port,
				protocol: this.protocol,
				vpc_id: `\${aws_vpc.${this.vpc}.id}`
			}),
			jsonRoot("aws_lb_listener", `${this.id}_listener`, {
				port: this.port,
				protocol: this.protocol,
				load_balancer_arn: `\${aws_lb.${this.id}.id}`,
				default_action: {
					type: "forward",
					target_group_arn: `\${aws_lb_target_group.${this.id}_target.arn}`
				}
			}),
			...this.instances.map(ec2 =>
				jsonRoot(
					"aws_lb_target_group_attachment",
					`${this.id}_${ec2.id}_attachment`,
					{
						target_group_arn: `\${aws_lb_target_group.${this.id}_target.arn}`,
						target_id: `\${aws_instance.${ec2.id}.id}`,
						port: this.port
					}
				)
			)
		];
	}

	getPolicyDocument() {
		return [];
	}
}
