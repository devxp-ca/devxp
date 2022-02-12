import {model} from "mongoose";
import {DatabaseModel, generateSchema} from "../types/database";
import {
	named,
	NamedRequiredProvider,
	RequiredProvider
} from "../types/terraform";
import {removeName} from "./util";

export interface AwsProvider extends named<RequiredProvider, "aws"> {
	region: string;
	access_key?: string;
	secret_key?: string;
}
export class AwsProvider
	extends NamedRequiredProvider
	implements DatabaseModel<AwsProvider>
{
	name: "aws";
	constructor();
	constructor(region: string);
	constructor(
		source: string,
		version: string,
		region: string,
		access_key: string,
		secret_key: string
	);
	constructor(
		source = "hashicorp/aws",
		version = ">= 2.7.0",
		region = "uswest-1",
		access_key?: string,
		secret_key?: string
	) {
		super(source, version, "aws");
		this.name = "aws";
		this.region = region;
		this.access_key = access_key;
		this.secret_key = secret_key;
	}

	toSchema() {
		return generateSchema<AwsProvider>(this);
	}

	toModel() {
		return model("AwsProvider", this.toSchema());
	}

	toJSON() {
		return {
			aws: [removeName(this)]
		};
	}
}
