import {CustomValidator} from "express-validator";

const jobValidator: CustomValidator = async (job: any) => {
	if (!job.type) {
		return Promise.reject(new Error("Pipeline jobs must have a type"));
	} else if (job.type === "terraform") {
		if (!job.provider) {
			return Promise.reject(
				new Error(
					"Pipeline jobs with type terraform must supply a provider"
				)
			);
		} else if (!job.provider.match(/^(aws|google|azure)$/)) {
			return Promise.reject(
				new Error(`Unknown provider "${job.provider}"`)
			);
		}
	} else {
		return Promise.reject(new Error(`Unknown job type "${job.type}"`));
	}
	return Promise.resolve(true);
};

export default jobValidator;
