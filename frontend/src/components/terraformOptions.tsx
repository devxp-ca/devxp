/* TODO: Add google fields, uncomment + add dynamoDB fields, implement lambda function fields */
export interface resourceSettings {
	type: string;
	id: string;
	autoIam: boolean;
	ami: string; // for ec2
	instance_type: string; // for ec2
	attributes: {
		//for dynamodb
		name: string;
		type: "S" | "N" | "B"; //"S" for string, "N" for number, or "B" for binary
		isHash: boolean; //For now just always set this true. Support for other types of keys hasn't been added yet
	}[];
	//for lambdafunctions
	functionName: string; // must match the regex /^[a-zA-Z][a-zA-Z0-9_]+$/ or /^([a-zA-Z0-9_\\.]+|[a-zA-Z0-9_/.]+)[a-zA-Z0-9_]+\.zip$/
	runtime: string; //values can be found in backend/src/types/terraform.ts
}

export interface terraformDataSettings {
	repo: string;
	tool: string;
	settings: {
		provider: string;
		secure: boolean;
		allowSsh?: boolean;
		allowEgressWeb?: boolean;
		allowIngressWeb?: boolean;
		autoLoadBalance?: boolean;
		project?: string;
		resources: resourceSettings[];
	};
}
