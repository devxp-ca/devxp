import {AwsProvider} from "../types/terraform";

export default (aws: AwsProvider) => {
	return [
		{
			aws: [aws]
		}
	];
};
