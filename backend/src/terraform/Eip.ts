import {jsonRoot, output} from "./util";
import {Resource} from "./resource";
import {TerraformJson} from "../types/terraform";

export interface Eip {
	instance: string;
	vpc: boolean;
}
export class Eip extends Resource<Eip> implements Eip {
	constructor(id: string, instance: string, vpc: boolean) {
		super(id, "Eip");
		this.instance = instance;
		this.vpc = vpc;
	}

	//Returns a resource block
	toJSON() {
		const json: any = {
			vpc: this.vpc
		};
		if (this.instance !== "") {
			json.instance = `\${aws_instance.${this.instance}.id}`;
		}

		return jsonRoot("aws_eip", this.id, json);
	}

	postProcess(json: TerraformJson): TerraformJson {
		json = super.postProcess(json);
		json.output = [
			...json.output,
			output(`${this.id}-public-ip`, `\${aws_eip.${this.id}.*.public_ip}`)
		];
		return json;
	}
}
