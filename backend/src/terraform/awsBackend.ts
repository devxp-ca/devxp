import {AwsBackend} from "../types/terraform";
import {removeName} from "./util";

export default (aws: AwsBackend) => {
	return [
		{
			s3: [removeName(aws)]
		}
	];
};
