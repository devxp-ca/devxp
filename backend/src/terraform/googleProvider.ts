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
	constructor(
		source: string,
		version: string,
		project: string | null = null,
		region: string | null = null,
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
