import {Model, model, Schema} from "mongoose";
import {NamedAwsBackend} from "../terraform/awsBackend";
import {AwsProvider} from "../terraform/awsProvider";
import {NamedGoogleBackend} from "../terraform/googleBackend";
import {GoogleProvider} from "../terraform/googleProvider";
import {
	DatabaseModel,
	generateSchema,
	generateSchemaInternals
} from "./database";

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
	| "ami-0ab399fb9d53c302f";

//TODO: Extend list of instance types
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
	| "t2.xlarge";

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
		this.required_providers = Array.isArray(required_providers)
			? required_providers
			: [required_providers];
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
