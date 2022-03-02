import {acl} from "../types/terraform";
import {jsonRoot} from "./util";
import {AwsResource} from "./resource";

export interface S3 {
	acl: acl;
}
export class S3 extends AwsResource<S3> implements S3 {
	constructor(id: string, autoIam?: boolean, acl?: acl) {
		super(id, "S3", autoIam);
		this.acl = acl ?? "private";
	}

	//Returns a resource block
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

	//An array of policy statements for IAM
	//These need to be researched from
	//https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_examples.html
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
