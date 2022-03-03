import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface SnsTopic {}
export class SnsTopic extends Resource<SnsTopic> implements SnsTopic {
	constructor(id: string) {
		super(id, "SnsTopic");
	}

	//Returns a resource block
	toJSON() {
		return jsonRoot("aws_sns_topic", this.id, {
			name: this.name
		});
	}
}
