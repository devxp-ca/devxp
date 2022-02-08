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
export interface googleProvider extends named<requiredProvider, "google"> {
	project?: string;
	region?: string;
	zone?: string;
	credentials?: string;
}
export const isGoogleProvider = (
	provider: namedRequiredProvider
): provider is googleProvider => provider.name === "google";

export interface awsProvider extends named<requiredProvider, "aws"> {
	region: string;
	access_key: string;
	secret_key: string;
}
export const isAwsProvider = (
	provider: namedRequiredProvider
): provider is awsProvider => provider.name === "aws";

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
