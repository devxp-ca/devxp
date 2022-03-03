import {jsonRoot} from "./util";
import {Resource} from "./resource";
import {arr} from "../util";

export interface IamRole {}
export class IamRole extends Resource<IamRole> implements IamRole {
	constructor(id: string) {
		super(id, "IamRole");
	}

	//Returns an array of resource blocks
	toJSON() {
		return jsonRoot("aws_iam_role", this.id, {
			name: this.id,
			assume_role_policy:
				'{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Action": "sts:AssumeRole",\n      "Principal": {\n        "Service": "lambda.amazonaws.com"\n      },\n      "Effect": "Allow",\n      "Sid": ""\n    }\n  ]\n}\n'
		});
	}
}
