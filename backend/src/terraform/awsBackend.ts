import CONFIG from "../config";
import {AwsBackend} from "../types/terraform";
import {removeName} from "./util";

export default (aws: AwsBackend) => {
	return [
		{
			s3: [removeName(aws)]
		}
	];
};

export const toResource = (aws: AwsBackend) => {
	const resource: any = {
		aws_s3_bucket: [{}]
	};
	resource.aws_s3_bucket[0][CONFIG.TERRAFORM.BACKEND_BUCKET] = [
		{
			bucket: aws.bucket
		}
	];
	return resource;
};
