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

// -------------------------------------------------------------------------- //

export type providerName = "google" | "aws";
export interface requiredProvider {
	source: string;
	version: string;
}
export interface namedRequiredProvider extends requiredProvider {
	name: providerName;
}

export interface googleProvider extends namedRequiredProvider {
	name: "google";
	project?: string;
	region?: string;
	zone?: string;
	credentials?: string;
}
export const isGoogleProvider = (
	provider: namedRequiredProvider
): provider is googleProvider => provider.name === "google";

export interface awsProvider extends namedRequiredProvider {
	name: "aws";
	profile?: string;
	region?: string;
}
export const isAwsProvider = (
	provider: namedRequiredProvider
): provider is awsProvider => provider.name === "aws";

// -------------------------------------------------------------------------- //

export interface awsBackend {
	bucket: string;
	key: string;
	region: string;
}
export interface gcpBackend {
	bucket: string;
	prefix: string;
}

export type terraformBackend = awsBackend | gcpBackend;
export interface terraform {
	required_providers: requiredProvider[];
	backend: terraformBackend;
}
