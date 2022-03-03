import {ec2InstanceType, amiType} from "../types/terraform";
import {jsonRoot} from "./util";
import {ResourceWithIam} from "./resource";

export interface Ec2 {
	ami: amiType;
	instance_type: ec2InstanceType;
}
export class Ec2 extends ResourceWithIam<Ec2> implements Ec2 {
	constructor(
		ami: amiType,
		instance_type: ec2InstanceType,
		id: string,
		autoIam?: boolean
	) {
		super(id, "Ec2", autoIam);
		this.ami = ami;
		this.instance_type = instance_type;
	}

	//Returns a resource block
	toJSON() {
		return jsonRoot("aws_instance", this.id, {
			ami: this.ami,
			instance_type: this.instance_type
		});
	}

	//An array of policy statements for IAM
	//These need to be researched from
	//https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_examples.html
	getPolicyDocument() {
		return [
			ResourceWithIam.policyStatement(
				[
					"ec2:RunInstances",
					"ec2:AssociateIamInstanceProfile",
					"ec2:ReplaceIamInstanceProfileAssociation"
				],
				"arn:aws:ec2:::*"
			),
			ResourceWithIam.policyStatement(
				"iam:PassRole",
				`\${aws_instance.${this.id}.arn}`
			)
		];
	}
}
