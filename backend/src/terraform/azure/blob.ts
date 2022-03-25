import {azureRegion} from "../../types/terraform";
import {jsonRoot} from "../util";
import {Resource} from "../resource";

export interface Blob {
	project: string;
	location: azureRegion;
}
export class Blob extends Resource<Blob> implements Blob {
	constructor(
		project: string,
		id: string,
		location: azureRegion = "westus",
		name?: string
	) {
		super(id, "Azure", false, name);
		this.project = project;
		this.location = location;
	}

	//Returns an array of resource blocks
	toJSON() {
		return [
			//The bucket itself
			jsonRoot("azurerm_storage_blob", this.id, {
				name: this.name,
				location: this.location,
				project: this.project
			})
		];
	}
}
