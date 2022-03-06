import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface IamRole {
	service: string;
}
export class IamRole extends Resource<IamRole> implements IamRole {
	constructor(id: string, service: string, name?: string) {
		super(id, "IamRole", false, name);
		this.service = service;
	}

	//Returns an array of resource blocks
	toJSON() {
		return jsonRoot("aws_iam_role", this.id, {
			name: this.name,
			assume_role_policy: JSON.stringify(
				{
					Version: "2012-10-17",
					Statement: [
						{
							Action: "sts:AssumeRole",
							Principal: {
								Service: this.service
							},
							Effect: "Allow",
							Sid: ""
						}
					]
				},
				null,
				2
			)
		});
	}
}
