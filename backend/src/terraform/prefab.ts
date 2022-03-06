import {Firewall, TerraformResource} from "../types/terraform";
import {arr} from "../util";
import {AwsSecurityGroup} from "./AwsSecurityGroup";
import {AwsVpc} from "./awsVpc";
import {Ec2} from "./ec2";

export const prefabNetwork = (
	instances: Ec2 | Ec2[],
	rules: {
		ssh?: boolean;
		sshCidr?: string[];
		allEgress?: boolean;
		web?: boolean;
		webCidr?: string[];
	},
	cidr = "10.0.0.0/24",
	vpc = "devxp_allow_ssh_vpc",
	securityGroup = "devxp_allow_ssh_security_group"
): TerraformResource[] => {
	instances = arr(instances);

	let firewalls: Firewall[] = [];
	if (rules.allEgress) {
		firewalls = [
			...firewalls,
			{
				type: "egress",
				from_port: 0,
				to_port: 0,
				protocol: "-1",
				cidr_blocks: ["0.0.0.0/0"]
			}
		];
	}
	if (rules.ssh) {
		firewalls = [
			...firewalls,
			{
				type: "ingress",
				from_port: 22,
				to_port: 22,
				protocol: "tcp",
				cidr_blocks: rules.sshCidr ?? ["0.0.0.0/0"]
			}
		];
	}
	if (rules.web) {
		firewalls = [
			...firewalls,
			{
				type: "ingress",
				from_port: 80,
				to_port: 80,
				protocol: "tcp",
				cidr_blocks: rules.webCidr ?? ["0.0.0.0/0"]
			},
			{
				type: "ingress",
				from_port: 433,
				to_port: 433,
				protocol: "tcp",
				cidr_blocks: rules.webCidr ?? ["0.0.0.0/0"]
			},
			{
				type: "egress",
				from_port: 80,
				to_port: 80,
				protocol: "tcp",
				cidr_blocks: rules.webCidr ?? ["0.0.0.0/0"]
			},
			{
				type: "egress",
				from_port: 433,
				to_port: 433,
				protocol: "tcp",
				cidr_blocks: rules.webCidr ?? ["0.0.0.0/0"]
			}
		];
	}

	return [
		...instances.map(
			(ec2: Ec2) =>
				new Ec2(
					ec2.ami,
					ec2.instance_type,
					ec2.id,
					ec2.autoIam,
					2,
					`${vpc}_subnet`,
					securityGroup
				)
		),

		new AwsVpc(cidr, true, vpc),
		new AwsSecurityGroup(securityGroup, vpc, firewalls)
	];
};
