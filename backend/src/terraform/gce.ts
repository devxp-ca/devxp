import {machineType} from "../types/terraform";
import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface Gce {
	project: string;
	machine_type: machineType;
	zone: string;
	disk_image: string;
}
export class Gce extends Resource<Gce> implements Gce {
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
		super(id, "Gce");
		this.project = project;
		this.machine_type = machine_type;
		this.zone = zone;
		this.disk_image = disk_image;
	}

	toJSON() {
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
