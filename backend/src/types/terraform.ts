import {Model, model, Schema} from "mongoose";
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

type named<Base, nameVal> = Base & {
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

// -- -- -- //

export interface GoogleProvider extends named<RequiredProvider, "google"> {
	project?: string;
	region?: string;
	zone?: string;
	credentials?: string;
}
export const isGoogleProvider = (
	provider: NamedRequiredProvider
): provider is GoogleProvider => provider.name === "google";

export class GoogleProvider
	extends NamedRequiredProvider
	implements GoogleProvider, DatabaseModel<GoogleProvider>
{
	name: "google";
	constructor(
		source: string,
		version: string,
		project: string | null = null,
		region: string | null = null,
		zone: string | null = null,
		credentials: string | null = null
	) {
		super(source, version, "google");
		this.name = "google";
		if (project) this.project = project;
		if (region) this.region = region;
		if (zone) this.zone = zone;
		if (credentials) this.credentials = credentials;
	}

	toSchema() {
		return generateSchema<GoogleProvider>(this);
	}

	toModel() {
		return model("GoogleProvider", this.toSchema());
	}
}

// -- -- -- //

export interface AwsProvider extends named<RequiredProvider, "aws"> {
	region: string;
	access_key: string;
	secret_key: string;
}
export const isAwsProvider = (
	provider: NamedRequiredProvider
): provider is AwsProvider => provider.name === "aws";

export class AwsProvider
	extends NamedRequiredProvider
	implements DatabaseModel<AwsProvider>
{
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
		return generateSchema<AwsProvider>(this);
	}

	toModel() {
		return model("AwsProvider", this.toSchema());
	}
}

// --------------------------------Backend----------------------------------- //

export interface AwsBackend {
	bucket: string;

	//Same as prefix
	key: string;
	region: string;
}
export interface NamedAwsBackend extends named<AwsBackend, "s3"> {}
export const isAwsBackend = (
	backend: namedTerraformBackend
): backend is named<AwsBackend, "s3"> => backend.name === "s3";

export class NamedAwsBackend implements DatabaseModel<NamedAwsBackend> {
	name: "s3";
	constructor(bucket: string, key: string, region: string) {
		this.name = "s3";
		this.bucket = bucket;
		this.key = key;
		this.region = region;
	}

	toSchema() {
		return generateSchema<NamedAwsBackend>(this);
	}
	toModel() {
		return model("AwsBackend", this.toSchema());
	}
}

// -- -- -- //

export interface GoogleBackend {
	bucket: string;
	prefix: string;
}
export interface NamedGoogleBackend extends named<GoogleBackend, "gcs"> {}
export const isGoogleBackend = (
	backend: namedTerraformBackend
): backend is named<GoogleBackend, "gcs"> => backend.name === "gcs";

export class NamedGoogleBackend implements DatabaseModel<NamedGoogleBackend> {
	name: "gcs";
	constructor(bucket: string, prefix: string) {
		this.name = "gcs";
		this.bucket = bucket;
		this.prefix = prefix;
	}

	toSchema() {
		return generateSchema<NamedGoogleBackend>(this);
	}
	toModel() {
		return model("GoogleBackend", this.toSchema());
	}
}

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
