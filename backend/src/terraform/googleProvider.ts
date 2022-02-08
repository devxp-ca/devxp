import {googleProvider} from "../types/terraform";

export default (google: googleProvider) => {
	return [
		{
			google: [google]
		}
	];
};
