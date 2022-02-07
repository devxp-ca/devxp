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

export interface requiredProvider {
	source: string;
	version: string;
}

export interface googleProvider {
	project?: string;
	region?: string;
	zone?: string;
	impersonate_service_account?: string;
	credentials?: string;
	scopes?: string;
	access_token?: string;
}

export interface awsProvider {
	project?: string;
	region?: string;
	zone?: string;
	impersonate_service_account?: string;
	credentials?: string;
	scopes?: string;
	access_token?: string;
}

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
