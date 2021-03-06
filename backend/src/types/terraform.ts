import {Model, model, Schema} from "mongoose";
import {NamedAwsBackend} from "../terraform/awsBackend";
import {AwsProvider} from "../terraform/awsProvider";
import {Ec2} from "../terraform/ec2";
import {Gce} from "../terraform/gce";
import {NamedGoogleBackend} from "../terraform/googleBackend";
import {GoogleProvider} from "../terraform/googleProvider";
import {S3} from "../terraform/s3";
import {DatabaseModel, generateSchemaInternals} from "./database";
import {arr} from "../util";
import {IamUser} from "../terraform/awsIamUser";
import {GlacierVault} from "../terraform/glacierVault";
import {lambdaFunction} from "../terraform/lambdaFunction";
import {AwsVpc} from "../terraform/awsVpc";
import {AwsInternetGateway} from "../terraform/AwsInternetGateway";
import {AwsRouteTable} from "../terraform/AwsRouteTable";
import {AwsSecurityGroup} from "../terraform/AwsSecurityGroup";
import {Eip} from "../terraform/Eip";
import {SnsTopic} from "../terraform/awsSnsTopic";
import {AwsSubnet} from "../terraform/awsSubnet";
import {AwsIamInstanceProfile} from "../terraform/AwsIamInstanceProfile";
import {AwsIamRolePolicyAttachment} from "../terraform/awsIamRolePolicyAttachment";
import {IamRole} from "../terraform/iamRole";
import {AwsRoute as AwsRouteResource} from "../terraform/AwsRoute";
import {AwsVpcEndpoint} from "../terraform/AwsVpcEndpoint";
import {DynamoDb} from "../terraform/DynamoDb";
import {AwsLoadBalancer} from "../terraform/awsLoadBalancer";
import {GoogleStorageBucket} from "../terraform/googleStorageBucket";
import {GoogleFunction} from "../terraform/googleFunction";
import {GoogleCloudRun} from "../terraform/googleCloudRun";

// ---------------------------------Variable---------------------------------- //
export type VariableType =
	| string
	| number
	| boolean
	| VariableType[]
	| Variable;

export interface VariableValidation {
	condition: string;
	error_message: string;
}

export interface Variable {
	type: VariableType;
	default?: VariableType;
	description?: string;
	validation?: VariableType[];
	sensative?: boolean;
	nullable?: boolean;
}

// ---------------------------------Utility---------------------------------- //

export type named<Base, nameVal> = Base & {
	name: nameVal;
};

// -------------------------------Provider----------------------------------- //

export type providerName = "google" | "aws";
export interface RequiredProvider {
	source: string;
	version: string;
}
export interface NamedRequiredProvider
	extends named<RequiredProvider, providerName> {}

export class NamedRequiredProvider {
	source: string;
	version: string;
	name: providerName;
	constructor(source: string, version: string, name: providerName) {
		this.source = source;
		this.version = version;
		this.name = name;
	}
}

export const isGoogleProvider = (
	provider: NamedRequiredProvider
): provider is GoogleProvider => provider.name === "google";

export const isAwsProvider = (
	provider: NamedRequiredProvider
): provider is AwsProvider => provider.name === "aws";

// --------------------------------Backend----------------------------------- //

export interface AwsBackend {
	bucket: string;

	//Same as prefix
	key: string;
	region: string;
}
export const isAwsBackend = (
	backend: namedTerraformBackend
): backend is NamedAwsBackend => backend.name === "s3";

// -- -- -- //

export interface GoogleBackend {
	bucket: string;
	prefix: string;
	location: string;
	project: string;
}
export const isGoogleBackend = (
	backend: namedTerraformBackend
): backend is NamedGoogleBackend => backend.name === "gcs";

// -- -- -- //

export type backendName = "s3" | "gcs";
export type terraformBackend = AwsBackend | GoogleBackend;
export type namedTerraformBackend = named<terraformBackend, backendName>;

// ----------------------------------EC2------------------------------------- //

//TODO: Extend list of AMIs
export type amiType =
	//Amazon Linux 2 AMI (HVM) - Kernel 5.10, SSD Volume Type 64-bit x86
	| "ami-0341aeea105412b57"

	//Ubuntu Server 20.04 LTS 64-bit x86
	| "ami-0892d3c7ee96c0bf7"

	//macOS Monterey 12.2
	| "ami-0faefa03f7ddcd657"

	//Microsoft Windows Server 2019 Base with Containers
	| "ami-0ab399fb9d53c302f"
	| "AUTO_UBUNTU"
	| "AUTO_Amazon"
	| "AUTO_WINDOWS";

export const defaultEc2User = (ami: amiType): string => {
	switch (ami) {
		case "AUTO_Amazon":
		case "ami-0341aeea105412b57":
			return "ec2-user";
		case "AUTO_UBUNTU":
		case "ami-0892d3c7ee96c0bf7":
			return "ubuntu";
		case "ami-0faefa03f7ddcd657":
			return "ec2-user";
		default:
			return "Administrator";
	}
};

//Check here for information about these types:
//https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html
export type ec2InstanceType =
	//1 CPU 1gB RAM
	| "t2.micro"

	//1 CPU 2gB RAM
	| "t2.small"

	//2 CPU 4gB RAM
	| "t2.medium"

	//2 CPU 8gB RAM
	| "t2.large"

	//4 CPU 16gB RAM
	| "t2.xlarge"

	//Compute optimized
	| "c3.2xlarge"

	//Compute optimitzed extra
	| "c3.8xlarge"

	//Storage Optimized
	| "d2.2xlarge"

	//Storage Optimized extra
	| "d2.8xlarge"

	//Memory Optimized
	| "r3.2xlarge"

	//Memory Optimized extra
	| "r3.8xlarge";

// ----------------------------------GCE------------------------------------- //

//TODO: Add more machine types
export type machineType =
	//1 cpu 614mB ram
	| "f1-micro"

	//1 cpu 3.75gB RAM
	| "n1-standard-1"

	//2 cpu 8GB Ram
	| "e2-standard-2"

	//4 cpu 16GB Ram
	| "e2-standard-8";

export type source_image =
	| "ubuntu-2004-focal-v20220204"
	| "centos-stream-8-v20220128"
	| "windows-server-2019-dc-v20220210"
	| "fedora-coreos-35-20220116-3-0-gcp-x86-64";

// ----------------------------------S3-------------------------------------- //

export type acl = "private" | "public-read" | "public-read-write";

// -------------------------------DynamoDb----------------------------------- //

export type billing_mode = "PROVISIONED" | "PAY_PER_REQUEST";
export interface db_attribute {
	name: string;
	type: "S" | "N" | "B";

	//TODO: Add sort key
	isHash?: boolean;
}

// ----------------------------LambdaFunction-------------------------------- //

export type runtime =
	| "nodejs"
	| "nodejs4.3"
	| "nodejs6.10"
	| "nodejs8.10"
	| "nodejs10.x"
	| "nodejs12.x"
	| "nodejs14.x"
	| "java8"
	| "java8.al2"
	| "java11"
	| "python2.7"
	| "python3.6"
	| "python3.7"
	| "python3.8"
	| "python3.9"
	| "dotnetcore1.0"
	| "dotnetcore2.0"
	| "dotnetcore2.1"
	| "dotnetcore3.1"
	| "nodejs4.3-edge"
	| "go1.x"
	| "ruby2.5"
	| "ruby2.7"
	| "provided"
	| "provided.al2";

export function isRuntime(test: string): test is runtime {
	// There must be a better way to do this
	const runtimeValues = [
		"nodejs",
		"nodejs4.3",
		"nodejs6.10",
		"nodejs8.10",
		"nodejs10.x",
		"nodejs12.x",
		"nodejs14.x",
		"java8",
		"java8.al2",
		"java11",
		"python2.7",
		"python3.6",
		"python3.7",
		"python3.8",
		"python3.9",
		"dotnetcore1.0",
		"dotnetcore2.0",
		"dotnetcore2.1",
		"dotnetcore3.1",
		"nodejs4.3-edge",
		"go1.x",
		"ruby2.5",
		"ruby2.7",
		"provided",
		"provided.al2"
	];
	return runtimeValues.includes(test);
}

// ----------------------------Google Function------------------------------- //

export type googleRuntime =
	| "nodejs16"
	| "nodejs14"
	| "nodejs12"
	| "nodejs10"
	| "nodejs8"
	| "nodejs6"
	| "python39"
	| "python38"
	| "python37"
	| "go116"
	| "go113"
	| "go111"
	| "java17"
	| "java11"
	| "dotnet3"
	| "ruby30"
	| "ruby27"
	| "ruby26"
	| "php74";

// ---------------------------------MISC------------------------------------- //

export type TerraformResource =
	| Ec2
	| Gce
	| S3
	| IamUser
	| GlacierVault
	| lambdaFunction
	| AwsVpc
	| AwsInternetGateway
	| AwsRouteTable
	| AwsSecurityGroup
	| SnsTopic
	| AwsSubnet
	| Eip
	| AwsIamInstanceProfile
	| AwsIamRolePolicyAttachment
	| IamRole
	| AwsVpcEndpoint
	| AwsRouteResource
	| DynamoDb
	| AwsLoadBalancer
	| GoogleStorageBucket
	| GoogleFunction
	| GoogleCloudRun;

export interface PolicyStatement {
	actions: string[];
	effect: string;
	resources: string[];
}

export interface TerraformJson {
	provider?: Record<string, any>[];
	data: Record<string, any>[];
	terraform: Record<string, any>[];
	resource: Record<string, any>[];
	variable: Record<string, any>[];
	output: Record<string, any>[];
}

export interface AwsRoute {
	gateway_id: string;
	cidr_block: string;
}

export interface Firewall {
	type: "egress" | "ingress";
	from_port: number | "icmp";
	to_port: number | "icmp";
	protocol: string;
	cidr_blocks?: string[];
}

export type char =
	| "a"
	| "b"
	| "c"
	| "d"
	| "e"
	| "f"
	| "g"
	| "h"
	| "i"
	| "j"
	| "k"
	| "l"
	| "m"
	| "n"
	| "o"
	| "p"
	| "q"
	| "r"
	| "s"
	| "t"
	| "u"
	| "v"
	| "w"
	| "x"
	| "y"
	| "z";
export type digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type countryCode = "us" | "af" | "ap" | "ca" | "eu" | "me" | "sa";
export type awsZone = `${countryCode}-${string}-${digit}`;
export type awsRegion = `${awsZone}${char}`;
export type gcpRegion = `${string}-${string}${digit}`;
export type gcpZone = `${gcpRegion}-${char}`;

export type load_balancer_type = "application" | "gateway" | "network";

// ----------------------------Terraform Root-------------------------------- //

export interface Terraform {
	required_providers: NamedRequiredProvider[];
	backend: terraformBackend;
}
export class Terraform implements DatabaseModel<Terraform> {
	constructor(
		required_providers: NamedRequiredProvider[] | NamedRequiredProvider,
		backend: terraformBackend
	) {
		this.required_providers = arr(required_providers);
		this.backend = backend;
	}

	toSchema() {
		return new Schema<Terraform, Model<Terraform>, Terraform>({
			required_providers: [
				generateSchemaInternals(this.required_providers[0])
			],
			backend: generateSchemaInternals(this.backend)
		});
	}
	toModel() {
		return model("Terraform", this.toSchema());
	}
}
