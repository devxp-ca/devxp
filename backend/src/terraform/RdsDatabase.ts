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
		username: string,
		password: string,
		instance: ec2InstanceType,
		autoIam?: boolean,
		name?: string
	) {
		super(id, "RdsDatabase", autoIam, name);
		this.allocated_storage = allocated_storage;
		this.engine = engine;
		this.username = username;
		this.password = password;
		this.instance = instance;
	}

	//Returns a resource block
	toJSON() {
		return jsonRoot("aws_db_instance", this.id, {
			name: this.name,
			allocated_storage: this.allocated_storage,
			engine: this.engine,
			username: this.username,
			password: this.password,
			instance: this.instance
		});
	}

	//https://asecure.cloud/l/iam/
	getPolicyDocument() {
		return [];
	}
}
