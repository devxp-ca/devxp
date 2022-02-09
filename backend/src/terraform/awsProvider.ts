import {AwsProvider} from "../types/terraform";
import {removeName} from "./util";

export default (aws: AwsProvider) => {
	return [
		{
			aws: [removeName(aws)]
		}
	];
};
