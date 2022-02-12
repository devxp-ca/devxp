import {model} from "mongoose";
import {DatabaseModel, generateSchema} from "../types/database";
import {
	named,
	NamedRequiredProvider,
	RequiredProvider
} from "../types/terraform";
import {removeName} from "./util";

export interface GoogleProvider extends named<RequiredProvider, "google"> {
	project?: string;
	region?: string;
	zone?: string;
	credentials?: string;
}
export class GoogleProvider
	extends NamedRequiredProvider
	implements GoogleProvider, DatabaseModel<GoogleProvider>
{
	name: "google";

	constructor();
	constructor(project: string);
	constructor(project: string, region: string);
	constructor(project: string, region: string, zone: string);
	constructor(
		source = "hashicorp/gcs",
		version = ">= 4.10.0",
		project: string | null = null,
		region = "uswest-1",
		zone: string | null = null,
		credentials: string | null = null
	) {
		super(source, version, "google");
		this.name = "google";
		if (project) this.project = project;
		if (region) this.region = region;
		if (zone) this.zone = zone;
		if (credentials) this.credentials = credentials;
	}

	toSchema() {
		return generateSchema<GoogleProvider>(this);
	}

	toModel() {
		return model("GoogleProvider", this.toSchema());
	}

	toJSON() {
		return {
			google: [removeName(this)]
		};
	}
}
