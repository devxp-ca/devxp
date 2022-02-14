import {
	NamedRequiredProvider,
	namedTerraformBackend,
	RequiredProvider
} from "../types/terraform";
import {NamedAwsBackend} from "./awsBackend";
import {AwsProvider} from "./awsProvider";
import {Ec2} from "./ec2";
import {Gce} from "./gce";
import {NamedGoogleBackend} from "./googleBackend";
import {GoogleProvider} from "./googleProvider";

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
			backend: [backend].map(namedBackend =>
				(namedBackend as NamedAwsBackend | NamedGoogleBackend).toJSON()
			)
		}
	];
};

export const rootBlock = (
	providers: NamedRequiredProvider[] | NamedRequiredProvider,
	backend: namedTerraformBackend,
	resources: (Ec2 | Gce)[] = []
) => {
	return {
		terraform: terraformBlock(providers, backend),
		provider: (Array.isArray(providers) ? providers : [providers]).map(
			provider => (provider as AwsProvider | GoogleProvider).toJSON()
		),
		resource: [
			(backend as NamedAwsBackend | NamedGoogleBackend).toResource(),
			...resources.map(r => r.toJSON())
		]
	};
};
