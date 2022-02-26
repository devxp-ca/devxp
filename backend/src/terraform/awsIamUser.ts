import {model} from "mongoose";
import {DatabaseModel, generateSchema} from "../types/database";
import {jsonRoot} from "./util";

export interface IamUser {
	id: string;
}
export class IamUser implements IamUser, DatabaseModel<IamUser> {
	constructor(id: string) {
		this.id = id;
	}

	toSchema() {
		return generateSchema<IamUser>(this);
	}
	toModel() {
		return model("IamUser", this.toSchema());
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
