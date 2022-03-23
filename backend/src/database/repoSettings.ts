import {machineType, runtime} from "../types/terraform";
import {mongoose} from "./connection";
const {Schema} = mongoose;

//================================ Terraform ====================================//
export interface terraformResource {
	type: string;
	id: string;
	ami: string;
	instance_type: string;
	autoIam: boolean;
	functionName: string;
	filename: string;
	runtime: runtime;
	handler: string;
	keepWarm: boolean;
	machine_type: machineType;
	disk_image: string;
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
	functionName: String,
	filename: String,
	runtime: String,
	handler: String,
	keepWarm: Boolean,
	machine_type: String,
	disk_image: String
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
