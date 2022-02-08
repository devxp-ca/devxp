import {
	isGoogleProvider,
	namedRequiredProvider,
	requiredProvider,
	awsProvider as awsProviderType,
	namedTerraformBackend,
	isGoogleBackend,
	awsBackend as awsBackendType
} from "../types/terraform";
import awsBackend from "./awsBackend";
import awsProvider from "./awsProvider";
import googleBackend from "./googleBackend";
import googleProvider from "./googleProvider";

export const terraformBlock = (
	providers: namedRequiredProvider[] | namedRequiredProvider
) => {
	const requiredProviders: {
		aws?: requiredProvider;
		google?: requiredProvider;
	} = {};

	(Array.isArray(providers) ? providers : [providers]).forEach(
		namedProvider => {
			const {name, ...provider} = namedProvider;
			requiredProviders[name] = provider;
		}
	);

	return [
		{
			required_providers: [requiredProviders],
			backend: []
		}
	];
};

export const rootBlock = (
	providers: namedRequiredProvider[] | namedRequiredProvider,
	backend: namedTerraformBackend
) => {
	return {
		terraform: terraformBlock(providers),
		providers: (Array.isArray(providers) ? providers : [providers]).map(
			provider => {
				if (isGoogleProvider(provider)) {
					return googleProvider(provider);
				}
				//else if (isAwsProvider(provider)){
				else {
					return awsProvider(provider as awsProviderType);
				}
			}
		),
		backend: [backend].map(namedBackend => {
			if (isGoogleBackend(namedBackend)) {
				return googleBackend(namedBackend);
			}
			//else if (isAwsBackend(namedBackend)){
			else {
				return awsBackend(namedBackend as awsBackendType);
			}
		})
	};
};
