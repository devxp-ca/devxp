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

	static latestAmiMap: Record<string, [string, string[]]> = {
		ubuntu: [
			"ubuntu/images/hvm-ssd/ubuntu-focal-20.04-arm64*",
			["099720109477", "333957572119", "679593333241"]
		],
		windows: ["*Windows Server*", ["374168611083", "679593333241"]],
		amazon: ["*AmazonLinux*", ["585441382316"]]
	};

	postProcess(json: Record<string, any>) {
		if (/^AUTO_(UBUNTU|WINDOWS|AMAZON)$/.test(this.ami)) {
			const os = this.ami.slice(5).toLowerCase();

			if ("data" in json && Array.isArray(json.data)) {
				json.data = [
					...json.data,
					jsonRoot("aws_ami", `${os}_latest`, {
						most_recent: true,
						owner: Ec2.latestAmiMap[os][1],
						filter: [
							{
								name: "name",
								values: [Ec2.latestAmiMap[os][0]]
							},
							{
								name: "virtualization-type",
								values: ["hvm"]
							}
						]
					})
				];
			}
		}
		return json;
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
