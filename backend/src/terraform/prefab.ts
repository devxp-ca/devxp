import {Firewall, TerraformResource} from "../types/terraform";
import {arr} from "../util";
import {AwsIamInstanceProfile} from "./AwsIamInstanceProfile";
import {AwsIamRolePolicyAttachment} from "./awsIamRolePolicyAttachment";
import {AwsLoadBalancer} from "./awsLoadBalancer";
import {AwsSecurityGroup} from "./AwsSecurityGroup";
import {AwsVpc} from "./awsVpc";
//import {AwsVpcEndpoint} from "./AwsVpcEndpoint";
import {DynamoDb} from "./DynamoDb";
import {Ec2} from "./ec2";
import {Gce} from "./gce";
import {GlacierVault} from "./glacierVault";
import {GoogleCloudRun} from "./googleCloudRun";
import {GoogleFunction} from "./googleFunction";
import {GoogleStorageBucket} from "./googleStorageBucket";
import {IamRole} from "./iamRole";
import {lambdaFunction} from "./lambdaFunction";
import {S3} from "./s3";

export type PrefabSupports =
	| Ec2
	| S3
	| GlacierVault
	| DynamoDb
	| AwsLoadBalancer
	| lambdaFunction;

export type googleResource =
	| Gce
	| GoogleStorageBucket
	| GoogleCloudRun
	| GoogleFunction;

export const splitForPrefab = (
	resources: TerraformResource[]
): [googleResource[], PrefabSupports[]] => {
	let google: any[] = [];
	let prefabSupports: PrefabSupports[] = [];

	resources.forEach(r => {
		if (
			r.type.toLowerCase() in
			["gce", "googlestoragebucket", "googlefunc", "cloudRun"]
		) {
			google = [...google, r];
		} else {
			prefabSupports = [...prefabSupports, r as PrefabSupports];
		}
	});

	return [google as googleResource[], prefabSupports];
};

export const prefabNetworkFromArr = (
	resources: PrefabSupports[],
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
	public_cidr = "10.0.0.0/25",
	public_cidr_2 = "10.0.128.0/25",
	private_cidr = "10.0.128.0/25",
	vpc = "devxp_vpc",
	securityGroup = "devxp_security_group"
) =>
	prefabNetwork(
		{
			ec2: resources.filter(r => r.type.toLowerCase() === "ec2") as Ec2[],
			s3: resources.filter(r => r.type.toLowerCase() === "s3") as S3[],
			dynamo: resources.filter(
				r => r.type.toLowerCase() === "dynamodb"
			) as DynamoDb[],
			glacier: resources.filter(
				r => r.type.toLowerCase() === "glaciervault"
			) as GlacierVault[],
			lambda: resources.filter(
				r => r.type.toLowerCase() === "lambdafunc"
			) as lambdaFunction[],
			load_balancer: resources.filter(
				r => r.type.toLowerCase() === "awsloadbalancer"
			) as AwsLoadBalancer[]
		},
		rules,
		vpc_cidr,
		public_cidr,
		public_cidr_2,
		private_cidr,
		vpc,
		securityGroup
	);

export const prefabNetwork = (
	resources: {
		ec2?: Ec2[] | Ec2;
		s3?: S3[] | S3;
		glacier?: GlacierVault[] | GlacierVault;
		dynamo?: DynamoDb[] | DynamoDb;
		lambda?: lambdaFunction | lambdaFunction[];
		load_balancer?: AwsLoadBalancer[] | AwsLoadBalancer;
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
	public_cidr = "10.0.0.0/25",
	public_cidr_2 = "10.0.128.0/25",
	private_cidr = "10.0.128.0/25",
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

				//TODO: Find a way to put this in the private subnet
				`${vpc}_subnet_public0`,
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
	const dbs = arr(resources.dynamo ?? []).map(
		(db: DynamoDb) => new DynamoDb(db.id, db.attributes, true, db.name)
	);
	const lambdas = arr(resources.lambda ?? []).map(
		(func: lambdaFunction) =>
			new lambdaFunction(
				func.id,
				func.functionName,
				func.filename,
				func.runtime,
				func.handler,
				func.keepWarm,
				true,
				{
					subnet: [`${vpc}_subnet_public0`],
					securityGroup: [securityGroup]
				}
			)
	);

	const lbs = arr(resources.load_balancer ?? []).map(
		(lb: AwsLoadBalancer) =>
			new AwsLoadBalancer(
				lb.id,
				vpc,
				lb.type,
				true,
				[securityGroup],
				[`${vpc}_subnet_public0`, `${vpc}_subnet_public1`],
				lb.protocol,
				lb.port,
				instances,
				lb.enable_http2,
				lb.enable_deletion_protection,
				false,
				lb.name
			)
	);

	const policies = [...buckets, ...vaults, ...dbs].map(
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
		...dbs,
		...lambdas,
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
			[public_cidr, public_cidr_2],
			vpc,
			["us-west-2a", "us-west-2b"],
			false,
			undefined,
			true
		),
		new AwsSecurityGroup(securityGroup, vpc, firewalls),
		...lbs
	];
};
