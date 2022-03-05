import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface AwsInternetGateway {
	vpc: string;
}
export class AwsInternetGateway
	extends Resource<AwsInternetGateway>
	implements AwsInternetGateway
{
	constructor(id: string, vpc: string, name?: string) {
		super(id, "AwsInternetGateway", false, name);
		this.vpc = vpc;
	}

	//Returns a resource block
	toJSON() {
		return jsonRoot("aws_internet_gateway", this.id, {
			vpc_id: `\${aws_vpc.${this.vpc}.id}`
		});
	}
}
