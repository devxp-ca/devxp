import {model} from "mongoose";
import {DatabaseModel, generateSchema} from "../types/database";
import {machineType} from "../types/terraform";
import {jsonRoot} from "./util";

export interface Gce {
	project: string;
	id: string;
	machine_type: machineType;
	zone: string;
	disk_image: string;
}
export class Gce implements Gce, DatabaseModel<Gce> {
	constructor(
		project: string,
		id: string,
		machine_type: machineType,
		disk_image: string
	);
	constructor(
		project: string,
		id: string,
		machine_type: machineType,
		disk_image: string,
		zone = "us-west1-a"
	) {
		this.project = project;
		this.id = id;
		this.machine_type = machine_type;
		this.zone = zone;
		this.disk_image = disk_image;
	}

	toSchema() {
		return generateSchema<Gce>(this);
	}
	toModel() {
		return model("Gce", this.toSchema());
	}

	toJSON() {
		//TODO: Generalize this as an inherited method
		const resource: any = {};
		resource[this.id] = [
			{
				name: this.id,
				machine_type: this.machine_type,
				zone: this.zone,
				network_interface: {
					network: "default"
				},
				boot_disk: {
					initialize_params: {
						image: this.disk_image
					}
				},
				project: this.project
			}
		];

		const requiredService: any = {};
		requiredService[`${this.id}-service`] = [
			{
				disable_on_destroy: false,
				service: "compute.googleapis.com"
			}
		];

		return [
			jsonRoot("google_compute_instance", this.id, {
				name: this.id,
				machine_type: this.machine_type,
				zone: this.zone,
				network_interface: {
					network: "default"
				},
				boot_disk: {
					initialize_params: {
						image: this.disk_image
					}
				},
				project: this.project
			}),
			jsonRoot("google_project_service", `${this.id}-service`, {
				disable_on_destroy: false,
				service: "compute.googleapis.com"
			})
		];
	}
}
