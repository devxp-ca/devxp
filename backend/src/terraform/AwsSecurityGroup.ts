import {jsonRoot} from "./util";
import {Resource} from "./resource";
import {Firewall} from "../types/terraform";

export interface AwsSecurityGroup {
	vpc: string;
	firewalls: Firewall[];
}
export class AwsSecurityGroup
	extends Resource<AwsSecurityGroup>
	implements AwsSecurityGroup
{
	constructor(
		id: string,
		vpc: string,
		firewalls: Firewall[] = [],
		name?: string
	) {
		super(id, "AwsSecurityGroup", false, name);
		this.vpc = vpc;
		this.firewalls = firewalls;
	}

	//Returns a resource block
	toJSON() {
		return jsonRoot("aws_security_group", this.id, {
			vpc_id: `\${aws_vpc.${this.vpc}.id}`,
			name: this.name,
			ingress: this.firewalls.filter(f => f.type === "ingress"),
			egress: this.firewalls.filter(f => f.type === "egress")
		});
	}
}
