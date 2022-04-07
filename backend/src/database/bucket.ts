import {mongoose} from "./connection";
const {Schema} = mongoose;

export interface backendSchemaType {
	repo: string;
	provider: string;
	bucketId: string;
}

export const backendSchema = new Schema({
	repo: String,
	provider: String,
	bucketId: String
});
export const BackendModel = mongoose.model("Backend", backendSchema);
