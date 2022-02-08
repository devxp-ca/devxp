import {namedRequiredProvider, requiredProvider} from "../types/terraform";

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
		terraform: terraformBlock(providers)
	};
};
