import {
	gcpRegion,
	googleRuntime,
	machineType,
	runtime,
	TerraformResource
} from "../types/terraform";
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

export const terraformSettingsSchema = (resources: TerraformResource[] = []) =>
	new Schema({
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
		resources: resources.map(resource => resource.toSchema())
	});

//================================ Repo ====================================//

export const repoSettingsSchema = (resources: TerraformResource[] = []) =>
	new Schema({
		repo: {type: String, required: true, unique: true},
		terraformSettings: terraformSettingsSchema(resources)
	});

export const RepoSettings = (resources: TerraformResource[] = []) =>
	mongoose.model("RepoSettings", repoSettingsSchema(resources));
