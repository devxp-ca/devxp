import {BaseResponse} from "../types/response";
import {mongoose} from "./connection";
const {Schema} = mongoose;

export interface ResponseSchema extends BaseResponse {}

export const responseSchema = new Schema({
	pullRequest: String,
	user: Number,
	initialPullRequest: String
});
export const ResponseModal = mongoose.model("Response", responseSchema);
