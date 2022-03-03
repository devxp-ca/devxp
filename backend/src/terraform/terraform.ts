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
import {IamUserForId} from "./awsIamUser";
import {ResourceWithIam} from "./resource";

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
	let data: any = [];

	return {
		terraform: terraformBlock(providers, backend),
		provider: arr(providers).map(provider =>
			(provider as AwsProvider | GoogleProvider).toJSON()
		),
		resource: [
			(backend as NamedAwsBackend | NamedGoogleBackend).toResource(),
			...resources
				.map(r => {
					let json = [r.toJSON()].flat();
					if (r.allowsIam) {
						json = [
							...json,
							new IamUserForId(r.id).toJSON()
						].flat();
						data = [
							...data,
							(r as ResourceWithIam<any>).toPolicyDocument()
						];
					}
					return json;
				})
				.flat()
		],
		data: data.flat()
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
