import {GoogleBackend} from "../types/terraform";

export default (google: GoogleBackend) => {
	return [
		{
			gcs: [google]
		}
	];
};
