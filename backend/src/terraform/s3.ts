import {acl} from "../types/terraform";
import {jsonRoot} from "./util";
import {ResourceWithIam} from "./resource";

export interface S3 {}
export class S3 extends ResourceWithIam<S3> implements S3 {
	constructor(id: string, autoIam?: boolean, name?: string) {
		super(id, "S3", autoIam, name);
	}

	//Returns a resource block
	toJSON() {
		return jsonRoot("aws_s3_bucket", this.id, {
			bucket: this.name
		});
	}

	//An array of policy statements for IAM
	//These need to be researched from
	//https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_examples.html
	getPolicyDocument() {
		return [
			ResourceWithIam.policyStatement(
				"s3:ListAllMyBuckets",
				"arn:aws:s3:::*"
			),
			ResourceWithIam.policyStatement(
				"s3:*",
				`\${aws_s3_bucket.${this.id}.arn}`
			)
		];
	}
}
