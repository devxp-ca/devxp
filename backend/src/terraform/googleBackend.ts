import {GoogleBackend} from "../types/terraform";
import {removeName} from "./util";

export default (google: GoogleBackend) => {
	return [
		{
			gcs: [removeName(google)]
		}
	];
};
