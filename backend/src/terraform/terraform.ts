import {
	isGoogleProvider,
	NamedRequiredProvider,
	AwsProvider as AwsProviderType,
	namedTerraformBackend,
	isGoogleBackend,
	AwsBackend as AwsBackendType,
	RequiredProvider
} from "../types/terraform";
import awsBackend, {toResource as backendToAwsResource} from "./awsBackend";
import awsProvider from "./awsProvider";
import googleBackend, {
	toResource as backendToGoogleResource
} from "./googleBackend";
import googleProvider from "./googleProvider";
import {namedDestructure} from "./util";

export const terraformBlock = (
	providers: NamedRequiredProvider[] | NamedRequiredProvider,
	backend: namedTerraformBackend
) => {
	return [
		{
			required_providers: [
				namedDestructure(providers, (p: RequiredProvider) => ({
					source: p.source,
					version: p.version
				}))
			],
			backend: [backend].map(namedBackend => {
				if (isGoogleBackend(namedBackend)) {
					return googleBackend(namedBackend);
				}
				//else if (isAwsBackend(namedBackend)){
				else {
					return awsBackend(namedBackend as AwsBackendType);
				}
			})
		}
	];
};

const buildResource = (backend: namedTerraformBackend) => {
	return isGoogleBackend(backend)
		? backendToGoogleResource(backend)
		: backendToAwsResource(backend as AwsBackendType);
};

export const rootBlock = (
	providers: NamedRequiredProvider[] | NamedRequiredProvider,
	backend: namedTerraformBackend
) => {
	return {
		terraform: terraformBlock(providers, backend),
		provider: (Array.isArray(providers) ? providers : [providers]).map(
			provider => {
				if (isGoogleProvider(provider)) {
					return googleProvider(provider);
				}
				//else if (isAwsProvider(provider)){
				else {
					return awsProvider(provider as AwsProviderType);
				}
			}
		),
		resource: [buildResource(backend)]
	};
};
