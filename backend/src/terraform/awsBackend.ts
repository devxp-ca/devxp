import {awsBackend} from "../types/terraform";

export default (aws: awsBackend) => {
	return [
		{
			s3: [aws]
		}
	];
};
