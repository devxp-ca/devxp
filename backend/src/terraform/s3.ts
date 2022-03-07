import {jsonRoot} from "./util";
import {ResourceWithIam} from "./resource";

export interface S3 {
	isPrivate: boolean;
}
export class S3 extends ResourceWithIam<S3> implements S3 {
	constructor(
		id: string,
		isPrivate = false,
		autoIam?: boolean,
		name?: string
	) {
		super(id, "S3", autoIam, name);
		this.isPrivate = isPrivate;
	}

	//Returns a resource block
	toJSON() {
		let json = [
			jsonRoot("aws_s3_bucket", this.id, {
				bucket: this.name
			})
		];

		if (this.isPrivate) {
			json = [
				...json,
				jsonRoot(
					"aws_s3_bucket_public_access_block",
					`${this.id}_access`,
					{
						bucket: `\${aws_s3_bucket.${this.id}.id}`,
						block_public_acls: true,
						block_public_policy: true
					}
				)
			];
		}
		return json;
	}

	//An array of policy statements for IAM
	//These need to be researched from
	//https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_examples.html
	//https://asecure.cloud/l/iam/
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
