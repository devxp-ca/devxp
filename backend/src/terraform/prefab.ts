import {Firewall, TerraformResource} from "../types/terraform";
import {arr} from "../util";
import {AwsIamInstanceProfile} from "./AwsIamInstanceProfile";
import {AwsIamRolePolicyAttachment} from "./awsIamRolePolicyAttachment";
import {AwsSecurityGroup} from "./AwsSecurityGroup";
import {AwsVpc} from "./awsVpc";
import {AwsVpcEndpoint} from "./AwsVpcEndpoint";
import {Ec2} from "./ec2";
import {GlacierVault} from "./glacierVault";
import {IamRole} from "./iamRole";
import {S3} from "./s3";

export const prefabNetwork = (
	resources: {
		ec2?: Ec2[] | Ec2;
		s3?: S3[] | S3;
		glacier?: GlacierVault[] | GlacierVault;
	},
	rules: {
		ssh?: boolean;
		sshCidr?: string[];
		allEgress?: boolean;
		allIngress?: boolean;
		webEgress?: boolean;
		webIngress?: boolean;
		webCidr?: string[];
	},
	vpc_cidr = "10.0.0.0/16",
	public_cidr = "10.0.0.0/24",
	private_cidr = "10.0.128.0/24",
	vpc = "devxp_vpc",
	securityGroup = "devxp_security_group"
): TerraformResource[] => {
	const instances = arr(resources.ec2 ?? []).map(
		(ec2: Ec2) =>
			new Ec2(
				ec2.ami,
				ec2.instance_type,
				ec2.id,
				ec2.autoIam,
				2,
				`${vpc}_subnet_public`,
				//`${vpc}_subnet_private`,
				securityGroup
			)
	);
	const buckets = arr(resources.s3 ?? []).map(
		(bucket: S3) => new S3(bucket.id, true, true, bucket.name)
	);
	const vaults = arr(resources.glacier ?? []).map(
		(vault: GlacierVault) => new GlacierVault(vault.id, true)
	);

	const policies = [...buckets, ...vaults].map(
		bucket => `${bucket.id}_iam_policy0`
	);
	const iamRoles = instances.map(
		ec2 => new IamRole(`${ec2.id}_iam_role`, "ec2.amazonaws.com")
	);

	let attachments: AwsIamRolePolicyAttachment[] = [];
	policies.forEach(p => {
		iamRoles.forEach(r => {
			attachments = [
				...attachments,
				new AwsIamRolePolicyAttachment(
					`${r.id}_${p}_attachment`,
					p,
					r.id
				)
			];
		});
	});

	const instanceProfiles = iamRoles.map(
		r => new AwsIamInstanceProfile(`${r.id}_instance_profile`, r.id)
	);
	instanceProfiles.forEach((p, i) => {
		instances[i].iam_instance_profile = p.id;
	});

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
	if (rules.allIngress) {
		firewalls = [
			...firewalls,
			{
				type: "ingress",
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
	if (rules.webIngress) {
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
				from_port: 443,
				to_port: 443,
				protocol: "tcp",
				cidr_blocks: rules.webCidr ?? ["0.0.0.0/0"]
			}
		];
	}
	if (rules.webEgress) {
		firewalls = [
			...firewalls,
			{
				type: "egress",
				from_port: 80,
				to_port: 80,
				protocol: "tcp",
				cidr_blocks: rules.webCidr ?? ["0.0.0.0/0"]
			},
			{
				type: "egress",
				from_port: 443,
				to_port: 443,
				protocol: "tcp",
				cidr_blocks: rules.webCidr ?? ["0.0.0.0/0"]
			}
		];
	}

	return [
		...instances,
		...buckets,
		...vaults,
		...instanceProfiles,
		...iamRoles,
		...attachments,
		// new AwsVpcEndpoint(`${vpc}_endpoint`, vpc, `com.amazonaws.us-west-2.s3`, [], {
		// 	isDefault: false,
		// 	id: `${vpc}_routetable_pub`
		// }),
		new AwsVpc(
			vpc_cidr,
			private_cidr,
			public_cidr,
			vpc,
			false,
			undefined,
			true
		),
		new AwsSecurityGroup(securityGroup, vpc, firewalls)
	];
};