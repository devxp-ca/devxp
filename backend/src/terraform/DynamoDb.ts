import {jsonRoot} from "./util";
import {ResourceWithIam} from "./resource";
import {db_attribute} from "../types/terraform";

export interface DynamoDb {
	attributes: db_attribute[];
}
export class DynamoDb extends ResourceWithIam<DynamoDb> implements DynamoDb {
	constructor(
		id: string,
		attributes: db_attribute[],
		autoIam?: boolean,
		name?: string
	) {
		super(id, "DynamoDb", autoIam, name);
		this.attributes = attributes;
	}

	//Returns a resource block
	toJSON() {
		return jsonRoot("aws_dynamodb_table", this.id, {
			name: this.name,
			hash_key: this.attributes.filter(a => a.isHash)[0]?.name,
			ttl: {
				attribute_name: "TimeToExist",
				enabled: false
			},
			attributes: this.attributes.map(a => {
				if ("isHash" in a) {
					delete a.isHash;
				}
				return a;
			})
		});
	}

	getPolicyDocument() {
		return ResourceWithIam.policyStatement(
			["dynamodb:DescribeTable", "dynamodb:Query", "dynamodb:Scan"],
			`\${aws_dynamodb_table.${this.id}.arn}`
		);
	}
}
