import {awsProvider} from "../types/terraform";

export default (aws: awsProvider) => {
	return [
		{
			aws: [aws]
		}
	];
};
