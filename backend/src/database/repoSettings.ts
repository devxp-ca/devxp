import {TerraformResource} from "../types/terraform";
import {mongoose} from "./connection";
const {Schema} = mongoose;

//================================ Terraform ====================================//

export interface terraformSettings {
	provider: string;
	resources: TerraformResource[];
	secure: boolean;
	allowSsh: boolean;
	allowEgressWeb: boolean;
	allowIngressWeb: boolean;
	autoLoadBalance: boolean;
	project: string;
}

// export const terraformSettingsSchema = (resources: TerraformResource[] = []) =>
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
	resources: [Schema.Types.Mixed] //resources.map(resource => resource.toSchema())
});

export const pipelineSettingsSchema = new Schema({
	jobs: [Schema.Types.Mixed]
});

//================================ Repo ====================================//

// export const repoSettingsSchema = (resources: TerraformResource[] = []) =>
export const repoSettingsSchema = new Schema({
	repo: {type: String, required: true, unique: true},
	terraformSettings: terraformSettingsSchema, //(resources)
	pipelineSettings: pipelineSettingsSchema //(resources)
});

// export const RepoSettings = (resources: TerraformResource[] = []) =>
export const RepoSettings = mongoose.model("RepoSettings", repoSettingsSchema); //(resources));
