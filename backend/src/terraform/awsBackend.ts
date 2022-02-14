import {model} from "mongoose";
import CONFIG from "../config";
import {DatabaseModel, generateSchema} from "../types/database";
import {AwsBackend, named} from "../types/terraform";
import {generateId, removeName} from "./util";

export interface NamedAwsBackend extends named<AwsBackend, "s3"> {}
export class NamedAwsBackend implements DatabaseModel<NamedAwsBackend> {
	name: "s3";
	constructor();
	constructor(bucket: string);
	constructor(bucket: string, region: string);
	constructor(bucket: string, key: string, region: string);
	constructor(
		bucket = `terraform-state-${generateId(45)}`,
		key = "terraform/state",
		region = "us-west-2"
	) {
		console.log(bucket, key, region);

		this.name = "s3";
		this.bucket = bucket;
		this.key = key;
		this.region = region;
	}
	toSchema() {
		return generateSchema<NamedAwsBackend>(this);
	}
	toModel() {
		return model("AwsBackend", this.toSchema());
	}

	toResource() {
		const resource: any = {
			aws_s3_bucket: [{}]
		};
		resource.aws_s3_bucket[0][CONFIG.TERRAFORM.BACKEND_BUCKET] = [
			{
				bucket: this.bucket
			}
		];
		return resource;
	}

	toJSON() {
		return {
			s3: [removeName(this)].map(a => ({
				bucket: a.bucket,
				key: a.key,
				region: a.region
			}))
		};
	}
}
