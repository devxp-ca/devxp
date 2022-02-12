import {model} from "mongoose";
import CONFIG from "../config";
import {DatabaseModel, generateSchema} from "../types/database";
import {GoogleBackend, named} from "../types/terraform";
import {generateId, removeName} from "./util";

export interface NamedGoogleBackend extends named<GoogleBackend, "gcs"> {}
export class NamedGoogleBackend implements DatabaseModel<NamedGoogleBackend> {
	name: "gcs";
	constructor();
	constructor(bucket: string);
	constructor(bucket: string, location: string);
	constructor(bucket: string, prefix: string, location: string);
	constructor(
		bucket = `terraform-state-${generateId(45)}`,
		prefix = "terraform/state",
		location = "uswest-1"
	) {
		this.name = "gcs";
		this.bucket = bucket;
		this.prefix = prefix;
		this.location = location;
	}

	toSchema() {
		return generateSchema<NamedGoogleBackend>(this);
	}
	toModel() {
		return model("GoogleBackend", this.toSchema());
	}

	toResource() {
		const resource: any = {
			google_storage_bucket: [{}]
		};
		resource.google_storage_bucket[0][CONFIG.TERRAFORM.BACKEND_BUCKET] = [
			{
				location: this.location,
				name: this.bucket
			}
		];
		return resource;
	}

	toJSON() {
		return {
			gcs: [removeName(this)].map(g => ({
				bucket: g.bucket,
				prefix: g.prefix
			}))
		};
	}
}
