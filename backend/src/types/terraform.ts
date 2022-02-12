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
