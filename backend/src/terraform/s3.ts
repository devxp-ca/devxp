import {model} from "mongoose";
import {DatabaseModel, generateSchema} from "../types/database";
import {acl} from "../types/terraform";

export interface S3 {
	acl: acl;
	id: string;
}
export class S3 implements S3, DatabaseModel<S3> {
	constructor(id: string, acl: acl = "private") {
		this.id = id;
		this.acl = acl;
	}

	toSchema() {
		return generateSchema<S3>(this);
	}
	toModel() {
		return model("S3", this.toSchema());
	}

	toJSON() {
		const resource: any = {};
		resource[this.id] = [
			{
				acl: this.acl,
				bucket: this.id,
				versioning: [
					{
						enabled: true
					}
				]
			}
		];

		return {
			aws_s3_bucket: [resource]
		};
	}
}
