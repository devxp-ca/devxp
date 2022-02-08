import {GoogleProvider} from "../types/terraform";

export default (google: GoogleProvider) => {
	return [
		{
			google: [google]
		}
	];
};
