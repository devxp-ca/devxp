import {gcpZone} from "../types/terraform";
import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface GoogleStorageBucket {
	project: string;
	zone: gcpZone;
}
export class GoogleStorageBucket
	extends Resource<GoogleStorageBucket>
	implements GoogleStorageBucket
{
	constructor(
		project: string,
		id: string,
		zone: gcpZone = "us-west1-a",
		name?: string
	) {
		super(id, "Gce", false, name);
		this.project = project;
		this.zone = zone;
	}

	//Returns an array of resource blocks
	toJSON() {
		return [
			//The bucket itself
			jsonRoot("google_storage_bucket", this.id, {
				name: this.name,
				zone: this.zone,
				project: this.project
			})
		];
	}
}
