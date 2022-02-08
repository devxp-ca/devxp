import {AwsBackend} from "../types/terraform";

export default (aws: AwsBackend) => {
	return [
		{
			s3: [aws]
		}
	];
};
