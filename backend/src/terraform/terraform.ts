import {
	isGoogleProvider,
	NamedRequiredProvider,
	RequiredProvider,
	AwsProvider as AwsProviderType,
	namedTerraformBackend,
	isGoogleBackend,
	AwsBackend as AwsBackendType
} from "../types/terraform";
import awsBackend from "./awsBackend";
import awsProvider from "./awsProvider";
import googleBackend from "./googleBackend";
import googleProvider from "./googleProvider";

export const terraformBlock = (
	providers: NamedRequiredProvider[] | NamedRequiredProvider
) => {
	const requiredProviders: {
		aws?: RequiredProvider;
		google?: RequiredProvider;
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
	providers: NamedRequiredProvider[] | NamedRequiredProvider,
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
					return awsProvider(provider as AwsProviderType);
				}
			}
		),
		backend: [backend].map(namedBackend => {
			if (isGoogleBackend(namedBackend)) {
				return googleBackend(namedBackend);
			}
			//else if (isAwsBackend(namedBackend)){
			else {
				return awsBackend(namedBackend as AwsBackendType);
			}
		})
	};
};
