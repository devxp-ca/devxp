import {jsonRoot} from "./util";
import {Resource} from "./resource";
import {IamRole} from "./iamRole";
import {runtime} from "../types/terraform";

export interface lambdaFunction {
	functionName: string;
	filename: string;
	runtime: runtime;
}

export class lambdaFunction
	extends Resource<lambdaFunction>
	implements lambdaFunction
{
	constructor(
		id: string,
		functionName: string,
		filename: string,
		runtime: runtime
	) {
		super(id, "lambdaFunction", false, functionName);
		this.functionName = functionName;
		this.filename = filename;
		this.runtime = runtime;
	}

	//Returns an array of resource blocks
	toJSON() {
		const iamRole = new IamRole("iam_for_lambda_" + this.functionName);
		return [
			iamRole.toJSON(),
			jsonRoot("aws_lambda_function", this.id, {
				function_name: this.functionName,
				role: `\${aws_iam_role.iam_for_lambda_${this.functionName}.arn}`,
				filename: this.filename,
				runtime: this.runtime,
				source_code_hash: `\${filebase64sha256("${this.filename}")}`
			})
		];
	}
}
