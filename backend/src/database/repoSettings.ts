import {
	gcpRegion,
	googleRuntime,
	machineType,
	runtime
} from "../types/terraform";
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
	runtime: runtime | googleRuntime;
	handler: string;
	keepWarm: boolean;
	machine_type: machineType;
	disk_image: string;
	attributes: {
		name: string;
		type: string;
		isHash: boolean;
	}[];
	name: string;
	project: string;
	location: gcpRegion;
	memory: number;
	entry_point: string;
	source_dir: string;
	trigger_http: boolean;
	image: string;
	env: string[];
	domain?: string;
}

export interface terraformSettings {
	provider: string;
	resources: terraformResource[];
	secure: boolean;
	allowSsh: boolean;
	allowEgressWeb: boolean;
	allowIngressWeb: boolean;
	autoLoadBalance: boolean;
	project: string;
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
	disk_image: String,
	name: String,
	project: String,
	location: String,
	memory: Number,
	entry_point: String,
	source_dir: String,
	trigger_http: Boolean,
	image: String,
	env: [String],
	domain: String,
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
	project: {
		default: "",
		type: String
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
