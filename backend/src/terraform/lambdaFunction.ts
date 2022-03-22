import {jsonRoot} from "./util";
import {Resource} from "./resource";
import {IamRole} from "./iamRole";
import {runtime, TerraformJson} from "../types/terraform";

export interface lambdaFunction {
	functionName: string;
	filename: string;
	runtime: runtime;
	handler: string;
	keepWarm: boolean;
	vpcInfo?: {
		subnet: string[];
		securityGroup: string[];
	};
}
//TODO: Link s3 bucket events
// https://stackoverflow.com/questions/68245765/add-trigger-to-aws-lambda-functions-via-terraform
export class lambdaFunction
	extends Resource<lambdaFunction>
	implements lambdaFunction
{
	constructor(
		id: string,
		functionName: string = id,
		filename: string,
		runtime: runtime,
		handler: string,
		keepWarm = false,
		autoIam?: boolean,
		vpcInfo?: {
			subnet: string[];
			securityGroup: string[];
		}
	) {
		super(id, "lambdaFunction", autoIam, functionName);
		this.functionName = functionName;
		this.filename = filename;
		this.runtime = runtime;
		this.handler = handler;
		this.keepWarm = keepWarm;
		this.vpcInfo = vpcInfo;
	}

	zipFilename() {
		const splitFn = this.filename.split("/");
		return `outputs/${splitFn[splitFn.length - 1]}.zip`;
	}

	//Returns an array of resource blocks
	toJSON() {
		const iamRole = new IamRole(
			"iam_for_lambda_" + this.functionName,
			"lambda.amazonaws.com"
		);

		const inner: any = {
			function_name: this.functionName,
			role: `\${aws_iam_role.iam_for_lambda_${this.functionName}.arn}`,
			filename: this.zipFilename(),
			runtime: this.runtime,
			source_code_hash: `\${data.archive_file.${this.id}-archive.output_base64sha256}`,
			handler: this.handler
		};
		if (this.vpcInfo) {
			inner.vpc_config = {
				subnet_ids: this.vpcInfo.subnet.map(
					sub => `\${aws_subnet.${sub}.id}`
				),
				security_group_ids: this.vpcInfo.securityGroup.map(
					sec => `\${aws_default_security_group.${sec}.id}`
				)
			};
		}

		let json = [
			iamRole.toJSON(),
			jsonRoot("aws_lambda_function", this.id, inner)
		];

		if (this.keepWarm) {
			json = [
				...json,
				jsonRoot(
					"aws_cloudwatch_event_rule",
					`${this.id}-warmer-rule`,
					{
						name: `${this.id}-warmer`,
						schedule_expression: "rate(1 minute)"
					}
				),
				jsonRoot(
					"aws_cloudwatch_event_target",
					`${this.id}-warmer-target`,
					{
						rule: `\${aws_cloudwatch_event_rule.${this.id}-warmer-rule.name}`,
						target_id: "Lambda",
						arn: `\${aws_lambda_function.${this.id}.arn}`
					}
				),
				jsonRoot(
					"aws_lambda_permission",
					`${this.id}-warmer-permission`,
					{
						statement_id: "AllowExecutionFromCloudWatch",
						action: "lambda:InvokeFunction",
						function_name: `\${aws_lambda_function.${this.id}.arn}`,
						principal: "events.amazonaws.com",
						source_arn: `\${aws_cloudwatch_event_rule.${this.id}-warmer-rule.arn}`
					}
				)
			];
		}

		return json;
	}

	postProcess(json: TerraformJson): TerraformJson {
		json = super.postProcess(json);
		json.data = [
			...json.data,
			jsonRoot("archive_file", `${this.id}-archive`, {
				type: "zip",
				source_file: this.filename,
				output_path: this.zipFilename()
			})
		];
		return json;
	}
}
