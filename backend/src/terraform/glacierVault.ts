import {jsonRoot} from "./util";
import {ResourceWithIam} from "./resource";
import {SnsTopic} from "./awsSnsTopic";

export interface GlacierVault {}
export class GlacierVault
	extends ResourceWithIam<GlacierVault>
	implements GlacierVault
{
	constructor(id: string, autoIam?: boolean, name?: string) {
		super(id, "GlacierVault", autoIam, name);
	}

	//Returns a resource block
	toJSON() {
		return [
			new SnsTopic(`${this.id}_sns_topic`).toJSON(),
			jsonRoot("aws_glacier_vault", this.id, {
				name: this.name,
				notification: [
					{
						sns_topic: `\${aws_sns_topic.${this.id}_sns_topic.arn}`,
						events: [
							"ArchiveRetrievalCompleted",
							"InventoryRetrievalCompleted"
						]
					}
				]
			})
		];
	}

	//An array of policy statements for IAM
	//These need to be researched from
	//https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_examples.html
	getPolicyDocument() {
		return [
			ResourceWithIam.policyStatement(
				[
					"glacier:InitiateJob",
					"glacier:GetJobOutput",
					"glacier:UploadArchive",
					"glacier:InitiateMultipartUpload",
					"glacier:AbortMultipartUpload",
					"glacier:CompleteMultipartUpload",
					"glacier:DescribeVault"
				],
				`\${aws_glacier_vault.${this.id}.arn}`
			),
			ResourceWithIam.policyStatement(["glacier:ListVaults"], "*")
		];
	}
}
