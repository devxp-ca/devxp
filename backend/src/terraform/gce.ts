import {model} from "mongoose";
import {DatabaseModel, generateSchema} from "../types/database";
import {machineType} from "../types/terraform";

export interface Gce {
	id: string;
	machine_type: machineType;
	zone: string;
	disk_image: string;
}
export class Gce implements Gce, DatabaseModel<Gce> {
	constructor(id: string, machine_type: machineType, disk_image: string);
	constructor(
		id: string,
		machine_type: machineType,
		disk_image: string,
		zone = "uswest-1"
	) {
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
				}
			}
		];

		return {
			google_compute_instance: [resource]
		};
	}
}
