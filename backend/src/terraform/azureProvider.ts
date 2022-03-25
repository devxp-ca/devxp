import {model} from "mongoose";
import {DatabaseModel, generateSchema} from "../types/database";
import {
	azureRegion,
	named,
	NamedRequiredProvider,
	RequiredProvider
} from "../types/terraform";
import {removeName} from "./util";

export interface AzureProvider extends named<RequiredProvider, "azurerm"> {
	features: object[];
	region: string;
}
export class AzureProvider
	extends NamedRequiredProvider
	implements DatabaseModel<AzureProvider>
{
	name: "azurerm";
	constructor();
	constructor(
		source = "hashicorp/azurerm",
		version = ">= 2.46.0",
		region: azureRegion = "West US",
		features = []
	) {
		super(source, version, "azurerm");
		this.name = "azurerm";
		this.features = features;
		this.region = region;
	}

	toSchema() {
		return generateSchema<AzureProvider>(this);
	}

	toModel() {
		return model("AzureProvider", this.toSchema());
	}

	toJSON() {
		return {
			azurerm: [
				{
					features: [{}]
				}
			]

			// 	[removeName(this)].map(withSource => {
			// 	if (!("source" in withSource)) {
			// 		return withSource;
			// 	}
			// 	const {source, ...withVersion} = withSource;
			// 	if (!("version" in withVersion)) {
			// 		return withVersion;
			// 	}
			// 	const {version, ...json} = withVersion;
			// 	return json;
			// })
		};
	}
}
