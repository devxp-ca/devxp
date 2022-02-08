import {DatabaseModel, generateSchema} from "./database";

// ---------------------------------Variable---------------------------------- //
export type variableType =
	| string
	| number
	| boolean
	| variableType[]
	| variable;

export interface variableValidation {
	condition: string;
	error_message: string;
}

export interface variable {
	type: variableType;
	default?: variableType;
	description?: string;
	validation?: variableValidation[];
	sensative?: boolean;
	nullable?: boolean;
}

// ---------------------------------Utility---------------------------------- //

type named<Base, nameVal> = Base & {
	name: nameVal;
};

// -------------------------------Provider----------------------------------- //

export type providerName = "google" | "aws";
export interface requiredProvider {
	source: string;
	version: string;
}
export type namedRequiredProvider = named<requiredProvider, providerName>;

export abstract class NamedRequiredProvider implements namedRequiredProvider {
	source: string;
	version: string;
	name: providerName;
	constructor(source: string, version: string, name: providerName) {
		this.source = source;
		this.version = version;
		this.name = name;
	}
}

export interface googleProvider extends named<requiredProvider, "google"> {
	project?: string;
	region?: string;
	zone?: string;
	credentials?: string;
}
export const isGoogleProvider = (
	provider: namedRequiredProvider
): provider is googleProvider => provider.name === "google";

export class GoogleProvider
	extends NamedRequiredProvider
	implements googleProvider, DatabaseModel<googleProvider>
{
	project?: string;
	region?: string;
	zone?: string;
	credentials?: string;
	name: "google";
	constructor(
		source: string,
		version: string,
		project: string | null,
		region: string | null,
		zone: string | null,
		credentials: string | null
	) {
		super(source, version, "google");
		this.name = "google";
		if (project) this.project = project;
		if (region) this.region = region;
		if (zone) this.zone = zone;
		if (credentials) this.credentials = credentials;
	}

	toSchema() {
		return generateSchema<googleProvider>(this);
	}
}

export interface awsProvider extends named<requiredProvider, "aws"> {
	region: string;
	access_key: string;
	secret_key: string;
}
export const isAwsProvider = (
	provider: namedRequiredProvider
): provider is awsProvider => provider.name === "aws";

export class AwsProvider
	extends NamedRequiredProvider
	implements awsProvider, DatabaseModel<awsProvider>
{
	region: string;
	access_key: string;
	secret_key: string;
	name: "aws";
	constructor(
		source: string,
		version: string,
		region: string,
		access_key: string,
		secret_key: string
	) {
		super(source, version, "aws");
		this.name = "aws";
		this.region = region;
		this.access_key = access_key;
		this.secret_key = secret_key;
	}

	toSchema() {
		return generateSchema<awsProvider>(this);
	}
}

// --------------------------------Backend----------------------------------- //

export type backendName = "s3" | "gcs";
export interface awsBackend {
	bucket: string;

	//Same as prefix
	key: string;
	region: string;
}
export type namedAwsBackend = named<awsBackend, "s3">;
export const isAwsBackend = (
	backend: namedTerraformBackend
): backend is named<awsBackend, "s3"> => backend.name === "s3";

export interface googleBackend {
	bucket: string;
	prefix: string;
}
export type namedGoogleBackend = named<googleBackend, "gcs">;
export const isGoogleBackend = (
	backend: namedTerraformBackend
): backend is named<googleBackend, "gcs"> => backend.name === "gcs";

export type terraformBackend = awsBackend | googleBackend;
export type namedTerraformBackend = named<terraformBackend, backendName>;

// ----------------------------Terraform Root-------------------------------- //

export interface terraform {
	required_providers: requiredProvider[];
	backend: terraformBackend;
}
