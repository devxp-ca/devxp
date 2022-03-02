import {acl} from "../types/terraform";
import {jsonRoot} from "./util";
import {AwsResource} from "./resource";

export interface S3 {
	acl: acl;
}
export class S3 extends AwsResource<S3> implements S3 {
	constructor(id: string, acl: acl = "private") {
		super(id, "S3");
		this.acl = acl;
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

	getPolicyDocument() {
		return [
			AwsResource.policyStatement(
				"s3:ListAllMyBuckets",
				"arn:aws:s3:::*"
			),
			AwsResource.policyStatement(
				"s3:*",
				`\${aws_s3_bucket.${this.id}.arn}`
			)
		];
	}
}
