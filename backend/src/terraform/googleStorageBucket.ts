import {gcpRegion} from "../types/terraform";
import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface GoogleStorageBucket {
	project: string;
	location: gcpRegion;
}
export class GoogleStorageBucket
	extends Resource<GoogleStorageBucket>
	implements GoogleStorageBucket
{
	constructor(
		project: string,
		id: string,
		location: gcpRegion = "us-west1",
		name?: string
	) {
		super(id, "Gce", false, name);
		this.project = project;
		this.location = location;
	}

	//Returns an array of resource blocks
	toJSON() {
		return [
			//The bucket itself
			jsonRoot("google_storage_bucket", this.id, {
				name: this.name,
				location: this.location,
				project: this.project
			})
		];
	}
}
