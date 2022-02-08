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

export interface googleProvider {
	project?: string;
	region?: string;
	zone?: string;
	credentials?: string;
}

export interface awsProvider {
	profile?: string;
	region?: string;
}

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
