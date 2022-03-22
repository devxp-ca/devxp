import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface AwsNatGateway {
	eip: string;
	subnet: string;
}
export class AwsNatGateway
	extends Resource<AwsNatGateway>
	implements AwsNatGateway
{
	constructor(id: string, eip: string, subnet: string) {
		super(id, "AwsNatGateway");
		this.eip = eip;
		this.subnet = subnet;
	}

	//Returns a resource block
	toJSON() {
		return jsonRoot("aws_nat_gateway", this.id, {
			allocation_id: `\${aws_eip.${this.eip}.id}`,
			subnet_id: `\${aws_subnet.${this.subnet}.id}`
		});
	}
}
