import {mongoose} from "./connection";
const {Schema} = mongoose;

export const responseSchema = new Schema({
	pullRequest: String,
	user: Number,
	initialPullRequest: String,
	provider: String,
	tool: String
});
export const ResponseModal = mongoose.model("Response", responseSchema);
