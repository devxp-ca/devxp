import {model} from "mongoose";
import {DatabaseModel, generateSchema} from "../types/database";
import {acl} from "../types/terraform";
import {jsonRoot} from "./util";

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
		return jsonRoot("aws_s3_bucket", this.id, {
			acl: this.acl,
			bucket: this.id,
			versioning: [
				{
					enabled: true
				}
			]
		});
	}
}
