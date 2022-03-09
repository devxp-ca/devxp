import {mongoose} from "./connection";
const {Schema} = mongoose;

//================================ Terraform ====================================//
export interface terraformResource {
	type: string;
	id: string;
	ami: string;
	instance_type: string;
	autoIam: boolean;
	attributes: {
		name: string;
		type: string;
		isHash: boolean;
	}[];
}

export interface terraformSettings {
	provider: string;
	resources: terraformResource[];
	secure: boolean;
	allowSsh: boolean;
	allowEgressWeb: boolean;
	allowIngressWeb: boolean;
	autoLoadBalance: boolean;
}

export const attributeSchema = new Schema({
	name: String,
	type: String,
	isHash: Boolean
});

export const terraformResourceSchema = new Schema({
	type: String,
	id: String,
	ami: String,
	instance_type: String,
	autoIam: {
		default: false,
		type: Boolean
	},
	attributes: [attributeSchema]
});

export const terraformSettingsSchema = new Schema({
	provider: String,
	secure: {
		default: false,
		type: Boolean
	},
	allowSsh: {
		default: false,
		type: Boolean
	},
	allowEgressWeb: {
		default: false,
		type: Boolean
	},
	allowIngressWeb: {
		default: false,
		type: Boolean
	},
	autoLoadBalance: {
		default: false,
		type: Boolean
	},
	resources: [terraformResourceSchema]
});

//================================ Repo ====================================//

export const repoSettingsSchema = new Schema({
	repo: {type: String, required: true, unique: true},
	terraformSettings: terraformSettingsSchema
});

export const RepoSettings = mongoose.model("RepoSettings", repoSettingsSchema);
