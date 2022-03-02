import {jsonRoot} from "./util";
import {Resource} from "./resource";
import {arr} from "../util";

export interface IamUser {
	policy: string[];
}
export class IamUser extends Resource<IamUser> implements IamUser {
	constructor(id: string, policy: string[] | string) {
		super(id, "IamUser");
		this.policy = arr(policy);
	}
	toJSON() {
		return [
			jsonRoot("aws_iam_user", this.id, {
				name: this.id
			}),
			...this.policy.map((policy, i) => {
				return jsonRoot(
					"aws_iam_user_policy_attachment",
					`${this.id}_policy_attachment${i}`,
					{
						user: `\${aws_iam_user.${this.id}.name}`,
						policy_arn: `\${aws_iam_policy.${policy}.arn}`
					}
				);
			}),
			jsonRoot("aws_iam_access_key", `${this.id}_access_key`, {
				user: `\${aws_iam_user.${this.id}.name}`
			})
		];
	}
}
