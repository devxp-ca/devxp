import {GoogleProvider} from "../types/terraform";
import {removeName} from "./util";

export default (google: GoogleProvider) => {
	return [
		{
			google: [removeName(google)]
		}
	];
};
