import {
	isGoogleProvider,
	namedRequiredProvider,
	requiredProvider,
	awsProvider as awsProviderType
} from "../types/terraform";
import awsProvider from "./awsProvider";
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
			required_providers: [requiredProviders]
		}
	];
};

export const rootBlock = (
	providers: namedRequiredProvider[] | namedRequiredProvider
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
		)
	};
};
