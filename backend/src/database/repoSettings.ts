import {mongoose} from "./connection";
const {Schema} = mongoose;

//================================ Terraform ====================================//
export interface terraformResource {
	type: string;
	id: string;
	ami: string;
	instance_type: string;
}

export interface terraformSettings {
	provider: string;
	resources: [terraformResource];
}

export const terraformResourceSchema = new Schema({
	type: String,
	id: String,
	ami: String,
	instance_type: String
});

export const terraformSettingsSchema = new Schema({
	provider: String,
	resources: [terraformResourceSchema]
});

export const saveTerraformSettings = (
	repo: string,
	settings: terraformSettings
) => {
	RepoSettings.updateOne(
		{repo: repo},
		{repo: repo, terraformSettings: settings},
		{upsert: true}
	);
};

//================================ Repo ====================================//

export const repoSettingsSchema = new Schema({
	repo: {type: String, required: true, unique: true},
	terraformSettings: terraformSettingsSchema
});

export const RepoSettings = mongoose.model("RepoSettings", repoSettingsSchema);
