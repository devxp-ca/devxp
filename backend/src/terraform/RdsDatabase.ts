import {jsonRoot} from "./util";
import {ResourceWithIam} from "./resource";
import {ec2InstanceType, rds_engine} from "../types/terraform";

export interface RdsDatabase {
	allocated_storage: number;
	engine: rds_engine;
	username: string;
	password: string;
	instance: ec2InstanceType;
}
export class RdsDatabase
	extends ResourceWithIam<RdsDatabase>
	implements RdsDatabase
{
	constructor(
		id: string,
		allocated_storage: number,
		engine: rds_engine,
		instance: ec2InstanceType,
		autoIam?: boolean,
		name?: string
	) {
		super(id, "RdsDatabase", autoIam, name);
		this.allocated_storage = allocated_storage;
		this.engine = engine;
		this.instance = instance;
	}

	//Returns a resource block
	toJSON() {
		return [
			jsonRoot("aws_db_instance", this.id, {
				name: this.name,
				allocated_storage: this.allocated_storage,
				engine: this.engine,
				username: `\${var.${this.id}-username}`,
				password: `\${var.${this.id}-password}`,
				instance: this.instance
			})
		];
	}

	//https://asecure.cloud/l/iam/
	getPolicyDocument() {
		return [
			ResourceWithIam.policyStatement(
				[
					"rds:Describe*",
					"rds:ListTagsForResource",
					"rds:CreateDBInstance",
					"rds:CreateDBSubnetGroup",
					"rds:DeleteDBInstance",
					"rds:StopDBInstance",
					"rds:StartDBInstance"
				],
				`\${aws_db_instance.${this.id}.arn}`
			)
		];
	}
}
