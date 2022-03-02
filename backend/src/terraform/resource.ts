import {model} from "mongoose";
import {DatabaseModel, generateSchema} from "../types/database";
import {jsonRoot} from "./util";
import {arr} from "../util";
import {PolicyStatement} from "../types/terraform";

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

	abstract toJSON(): Record<string, any>;
}

export abstract class AwsResource<Specific> extends Resource<Specific> {
	constructor(id: string, type: string, autoIam = false, name?: string) {
		super(id, type, autoIam, name);
		this.allowsIam = true;
	}

	abstract getPolicyDocument(): PolicyStatement[];
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

	//https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_examples.html
	toPolicyDocument(statement?: PolicyStatement[]) {
		return [
			jsonRoot("aws_iam_policy_document", `${this.id}_policy_document`, {
				statement: statement ?? this.getPolicyDocument()
			})
		];
	}
}
