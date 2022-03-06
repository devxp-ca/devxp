import {ec2InstanceType, amiType, TerraformJson} from "../types/terraform";
import {jsonRoot} from "./util";
import {ResourceWithIam} from "./resource";
import {Eip} from "./Eip";
import {arr} from "../util";

export interface Ec2 {
	ami: amiType;
	instance_type: ec2InstanceType;
	eip: boolean;
	subnet?: string;
	securityGroups?: string[] | string;
}
export class Ec2 extends ResourceWithIam<Ec2> implements Ec2 {
	constructor(
		ami: amiType,
		instance_type: ec2InstanceType,
		id: string,
		autoIam?: boolean,
		eip?: boolean,
		subnet?: string,
		securityGroups?: string[] | string
	) {
		super(id, "Ec2", autoIam);
		this.ami = ami;
		this.instance_type = instance_type;
		this.eip = eip ?? false;
		this.subnet = subnet;
		this.securityGroups = securityGroups;
	}

	//Returns a resource block
	toJSON() {
		const isAutoAmi = /^AUTO_(UBUNTU|WINDOWS|AMAZON)$/.test(this.ami);
		const ami = isAutoAmi
			? `\${data.aws_ami.${this.ami.slice(5).toLowerCase()}_latest.id}`
			: this.ami;

		const json: any = {
			ami,
			instance_type: this.instance_type
		};

		if (isAutoAmi) {
			json.lifecycle = [
				{
					ignore_changes: ["ami"]
				}
			];
		}

		if (this.subnet) {
			json.subnet_id = `\${aws_subnet.${this.subnet}.id}`;
			json.associate_public_ip_address = true;
		}

		if (this.securityGroups) {
			json.vpc_security_group_ids = arr(this.securityGroups).map(
				g => `\${aws_security_group.${g}.id}`
			);
		}

		let output = [jsonRoot("aws_instance", this.id, json)];

		if (this.eip) {
			output = [
				...output,

				//TODO: Check for VPC
				new Eip(`${this.id}_eip`, this.id, false)
			];
		}

		return output;
	}

	static latestAmiMap: Record<string, [string, string[]]> = {
		ubuntu: [
			"ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64*",
			["099720109477"]
		],
		windows: ["*Windows Server*", ["374168611083", "679593333241"]],
		amazon: ["*AmazonLinux*", ["585441382316"]]
	};

	postProcess(json: TerraformJson): TerraformJson {
		json = super.postProcess(json);

		if (/^AUTO_(UBUNTU|WINDOWS|AMAZON)$/.test(this.ami)) {
			const os = this.ami.slice(5).toLowerCase();

			if ("data" in json && Array.isArray(json.data)) {
				json.data = [
					...json.data,
					jsonRoot("aws_ami", `${os}_latest`, {
						most_recent: true,
						owners: Ec2.latestAmiMap[os][1],
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
