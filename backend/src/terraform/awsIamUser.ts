import {jsonRoot} from "./util";
import {Terraform} from "./resource";

export interface IamUser {}
export class IamUser extends Terraform<IamUser> implements IamUser {
	constructor(id: string) {
		super(id, "IamUser");
	}
	toJSON() {
		return [
			jsonRoot("aws_iam_user", this.id, {
				name: this.id
			}),
			jsonRoot("aws_iam_user_policy", `${this.id}_policy`, {
				name: `${this.id}_policy`,
				user: `\${aws_iam_user.${this.id}.name}`
			})
		];
	}
}
