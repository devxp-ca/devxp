import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface AwsIamRolePolicyAttachment {
	role: string;
	policy: string;
}
export class AwsIamRolePolicyAttachment
	extends Resource<AwsIamRolePolicyAttachment>
	implements AwsIamRolePolicyAttachment
{
	constructor(id: string, policy: string, role: string, name?: string) {
		super(id, "AwsIamRolePolicyAttachment", false, name);

		this.policy = policy;
		this.role = role;
	}

	//Returns an array of resource blocks
	toJSON() {
		return [
			//The iam user block itself
			jsonRoot("aws_iam_role_policy_attachment", this.id, {
				policy_arn: `\${aws_iam_policy.${this.policy}.arn}`,
				role: `\${aws_iam_role.${this.role}.name}`
			})
		];
	}
}
