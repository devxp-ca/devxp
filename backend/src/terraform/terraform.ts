import {
	NamedRequiredProvider,
	namedTerraformBackend,
	RequiredProvider,
	TerraformJson,
	TerraformResource
} from "../types/terraform";
import {NamedAwsBackend} from "./awsBackend";
import {AwsProvider} from "./awsProvider";
import {NamedGoogleBackend} from "./googleBackend";
import {GoogleProvider} from "./googleProvider";

import {namedDestructure} from "./util";
import {arr} from "../util";
import {IamUserForId} from "./awsIamUser";

export const terraformBlock = (
	providers: NamedRequiredProvider[] | NamedRequiredProvider,
	backend: namedTerraformBackend,
	forBackend = false
) => {
	const reqProviders = [
		namedDestructure(providers, (p: RequiredProvider) => ({
			source: p.source,
			version: p.version
		}))
	];

	const backendBlock = [backend].map(namedBackend =>
		(namedBackend as NamedAwsBackend | NamedGoogleBackend).toJSON()
	);

	return [
		forBackend
			? {
					required_providers: reqProviders
			  }
			: {
					backend: backendBlock
			  }
	];
};

export const rootBlock = (
	providers: NamedRequiredProvider[] | NamedRequiredProvider,
	backend: namedTerraformBackend,
	resources: TerraformResource[] = []
): [any, any] => {
	let json: TerraformJson = {
		terraform: terraformBlock(providers, backend, false),
		provider: arr(providers).map(provider =>
			(provider as AwsProvider | GoogleProvider).toJSON()
		),
		resource: resources
			.map(r => {
				let json = [r.toJSON()].flat();
				if (r.allowsIam && r.autoIam) {
					json = [...json, new IamUserForId(r.id).toJSON()].flat();
				}
				return json;
			})
			.flat(),
		data: [],
		variable: [],
		output: []
	};

	// Allow each resource to apply post processing
	resources.forEach(r => {
		json = r.postProcess(json);
	});

	return [
		json,
		{
			resource: [
				(backend as NamedAwsBackend | NamedGoogleBackend).toResource()
			],
			terraform: terraformBlock(providers, backend, true)
		}
	];
};
