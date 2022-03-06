import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface AwsIamInstanceProfile {
	role: string;
}
export class AwsIamInstanceProfile
	extends Resource<AwsIamInstanceProfile>
	implements AwsIamInstanceProfile
{
	constructor(id: string, role: string, name?: string) {
		super(id, "AwsIamInstanceProfile", false, name);
		this.role = role;
	}

	//Returns an array of resource blocks
	toJSON() {
		return jsonRoot("aws_iam_instance_profile", this.id, {
			name: this.name,
			role: `\${aws_iam_role.${this.role}.name}`
		});
	}
}
