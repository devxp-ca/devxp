import {model} from "mongoose";
import {DatabaseModel, generateSchema} from "../types/database";
import {
	named,
	NamedRequiredProvider,
	RequiredProvider,
	gcpZone,
	gcpRegion
} from "../types/terraform";
import {removeName} from "./util";

export interface GoogleProvider extends named<RequiredProvider, "google"> {
	project: string;
	region?: gcpRegion;
	zone?: gcpZone;
	credentials?: string;
}
export class GoogleProvider
	extends NamedRequiredProvider
	implements GoogleProvider, DatabaseModel<GoogleProvider>
{
	name: "google";

	constructor(project: string);
	constructor(project: string, region: gcpRegion);
	constructor(project: string, region: gcpRegion, zone: gcpZone);
	constructor(
		project: string,
		source = "hashicorp/google",
		version = ">= 4.10.0",
		region: gcpRegion = "us-west1",
		zone: gcpZone | null = null,
		credentials: string | null = null
	) {
		super(source, version, "google");
		this.name = "google";
		this.project = project;
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
			google: [removeName(this)].map(withSource => {
				if (!("source" in withSource)) {
					return withSource;
				}
				const {source, ...withVersion} = withSource;
				if (!("version" in withVersion)) {
					return withVersion;
				}
				const {version, ...json} = withVersion;
				return json;
			})
		};
	}
}
