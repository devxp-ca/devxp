import {ec2InstanceType, amiType} from "../types/terraform";
import {jsonRoot} from "./util";
import {AwsResource} from "./resource";

export interface Ec2 {
	ami: amiType;
	instance_type: ec2InstanceType;
}
export class Ec2 extends AwsResource<Ec2> implements Ec2 {
	constructor(ami: amiType, instance_type: ec2InstanceType, id: string) {
		super(id, "Ec2");
		this.ami = ami;
		this.instance_type = instance_type;
	}

	toJSON() {
		return jsonRoot("aws_instance", this.id, {
			ami: this.ami,
			instance_type: this.instance_type
		});
	}

	getPolicyDocument() {
		return [
			AwsResource.policyStatement(
				[
					"ec2:RunInstances",
					"ec2:AssociateIamInstanceProfile",
					"ec2:ReplaceIamInstanceProfileAssociation"
				],
				"arn:aws:ec2:::*"
			),
			AwsResource.policyStatement(
				"iam:PassRole",
				`\${aws_instance.${this.id}.arn}`
			)
		];
	}
}
