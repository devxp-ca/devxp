import {model} from "mongoose";
import {DatabaseModel, generateSchema} from "../types/database";
import {jsonRoot} from "./util";
import {arr} from "../util";
import {PolicyStatement, TerraformJson} from "../types/terraform";

export abstract class Resource<Specific> implements DatabaseModel<Specific> {
	id: string;
	name: string;
	type: string;
	autoIam: boolean;
	allowsIam?: boolean;

	constructor(id: string, type: string, autoIam = false, name?: string) {
		this.id = id;
		this.type = type;
		this.name = name ?? id;
		this.autoIam = autoIam;
	}

	toSchema() {
		return generateSchema<Specific>(this as unknown as Specific);
	}
	toModel() {
		return model(this.type, this.toSchema());
	}

	postProcess(json: TerraformJson): TerraformJson {
		return json;
	}

	abstract toJSON(): Record<string, any>;
}

//Inherits from Resource
//Adds support for automatic AWS IAM generation
//TODO: Add a GCP version of this class
export abstract class ResourceWithIam<Specific> extends Resource<Specific> {
	constructor(id: string, type: string, autoIam = false, name?: string) {
		super(id, type, autoIam, name);
		this.allowsIam = true;
	}

	//Must be implemented by children
	abstract getPolicyDocument(): PolicyStatement[] | PolicyStatement;

	//Helper method for generating policy statements
	static policyStatement(
		actions: string | string[],
		resources: string | string[]
	) {
		return {
			actions: arr(actions),
			effect: "Allow",
			resources: arr(resources)
		} as PolicyStatement;
	}

	postProcess(json: TerraformJson): TerraformJson {
		json = super.postProcess(json);

		if (this.autoIam) {
			json.data = [...json.data, this.toPolicyDocument()].flat();
		}
		return json;
	}

	//https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_examples.html
	toPolicyDocument(statement?: PolicyStatement[]) {
		return [
			jsonRoot(
				"aws_iam_policy_document",
				`${this.id}_iam_policy_document`,
				{
					statement: statement ?? arr(this.getPolicyDocument())
				}
			)
		];
	}
}
//
// export abstract class GoogleResource<Specific> extends Resource<Specific> {
// 	postProcess(json: TerraformJson): TerraformJson{
// 		json = super.postProcess(json);
//
// 		//filter for duplicate google project services
// 		const hash: any = {};
// 		json.resource = json.resource.filter(r => {
// 			if(r.name === "google_project_service"){
// 				if(hash[`${r.name}-${Object.keys(r.name[0])[0]}`]){
// 					return false;
// 				}
// 				hash[`${r.name}-${Object.keys(r.name[0])[0]}`] = true;
// 			}
// 			return true;
// 		});
//
// 		return json;
// 	}
// }
