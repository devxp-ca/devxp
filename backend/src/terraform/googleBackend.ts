import {googleBackend} from "../types/terraform";

export default (google: googleBackend) => {
	return [
		{
			gcs: [google]
		}
	];
};
