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

	//Returns an array of resource blocks
	toJSON() {
		return [
			//The iam user block itself
			jsonRoot("aws_iam_user", this.id, {
				name: this.id
			}),

			//The attachment policy resource blocks
			...this.policy
				.map((policy, i) => {
					return [
						jsonRoot(
							"aws_iam_user_policy_attachment",
							`${this.id}_policy_attachment${i}`,
							{
								user: `\${aws_iam_user.${this.id}.name}`,
								policy_arn: `\${aws_iam_policy.${policy}${i}.arn}`
							}
						),
						jsonRoot("aws_iam_policy", `${this.id}_policy${i}`, {
							name: `${this.id}_policy${i}`,
							path: "/",
							policy: `\${data.aws_iam_policy_document.${this.id}_policy_document.json}`
						})
					];
				})
				.flat(),

			//The programmatic access key resource block
			jsonRoot("aws_iam_access_key", `${this.id}_access_key`, {
				user: `\${aws_iam_user.${this.id}.name}`
			})
		];
	}
}

export class IamUserForId extends IamUser {
	constructor(id: string) {
		super(`${id}_iam`, `${id}_iam_policy`);
	}
}
