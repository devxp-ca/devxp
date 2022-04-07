import {mongoose} from "./connection";
const {Schema} = mongoose;

export interface AnalyticSchema {
	repo: string;
	user: string;
	pullRequests: number;
}

export const analyticSchema = new Schema({
	repo: String,
	user: String,
	pullRequests: Number
});
export const AnalyticModal = mongoose.model("Analytic", analyticSchema);
