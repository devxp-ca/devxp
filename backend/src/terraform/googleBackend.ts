import CONFIG from "../config";
import {GoogleBackend} from "../types/terraform";
import {removeName} from "./util";

export default (google: GoogleBackend) => {
	return [
		{
			gcs: [removeName(google)].map(g => ({
				bucket: g.bucket,
				prefix: g.prefix
			}))
		}
	];
};

export const toResource = (google: GoogleBackend) => {
	const resource: any = {
		google_storage_bucket: [{}]
	};
	resource.google_storage_bucket[0][CONFIG.TERRAFORM.BACKEND_BUCKET] = [
		{
			location: google.location,
			name: google.bucket
		}
	];
	return resource;
};
