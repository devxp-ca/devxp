import {
	NamedRequiredProvider,
	namedTerraformBackend,
	RequiredProvider,
	TerraformResource
} from "../types/terraform";
import {NamedAwsBackend} from "./awsBackend";
import {AwsProvider} from "./awsProvider";
import {NamedGoogleBackend} from "./googleBackend";
import {GoogleProvider} from "./googleProvider";

import {namedDestructure} from "./util";
import {arr} from "../util";

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
			backend: [backend].map(namedBackend =>
				(namedBackend as NamedAwsBackend | NamedGoogleBackend).toJSON()
			)
		}
	];
};

export const rootBlock = (
	providers: NamedRequiredProvider[] | NamedRequiredProvider,
	backend: namedTerraformBackend,
	resources: TerraformResource[] = []
) => {
	return {
		terraform: terraformBlock(providers, backend),
		provider: arr(providers).map(provider =>
			(provider as AwsProvider | GoogleProvider).toJSON()
		),
		resource: [
			(backend as NamedAwsBackend | NamedGoogleBackend).toResource(),
			...resources.map(r => r.toJSON()).flat()
		]
	};
};

export const rootBlockSplitBackend = (
	providers: NamedRequiredProvider[] | NamedRequiredProvider,
	backend: namedTerraformBackend,
	resources: TerraformResource[] = []
) => {
	const root = rootBlock(providers, backend, resources);
	const backendBlock = root.terraform[0].backend;
	const noBackend = root.terraform[0].required_providers;

	(root.terraform as any) = [{required_providers: noBackend}];
	return [
		root,
		{
			terraform: [
				{
					backend: backendBlock
				}
			]
		}
	];
};
