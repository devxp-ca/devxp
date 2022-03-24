import {CustomValidator} from "express-validator";
import {db_attribute, isRuntime} from "../types/terraform";

export const resourceTypes = /^(ec2|gce|s3|lambdaFunc|glacierVault|dynamoDb)$/;

const hasAllKeys = (obj: any, keys: string[]) => {
	let retVal = true;
	keys.forEach(key => {
		if (!(key in obj)) {
			retVal = false;
		}
	});
	return retVal;
};

export const uniquenessValidator: CustomValidator = (resources: any) => {
	const hash: Record<string, boolean> = {};
	let flag = true;
	if (Array.isArray(resources)) {
		resources.forEach(resource => {
			if ("id" in resource) {
				if (resource.id in hash) {
					flag = false;
				}
				hash[resource.id] = true;
			}
		});
	}
	return flag;
};

const resourceValidator: CustomValidator = async (resource: any) => {
	console.dir(resource);
	if (resource.type === "ec2") {
		if (!hasAllKeys(resource, ["ami", "instance_type", "id"])) {
			return Promise.reject(new Error("Resource is missing keys"));
		}
		if (!/^ami-[0-9a-zA-Z]+$/.test(resource.ami)) {
			if (!/^AUTO_(UBUNTU|WINDOWS|AMAZON)$/.test(resource.ami)) {
				return Promise.reject(new Error("Invaid AMI"));
			}
		}

		//MAC Must use mac1.metal instance type
		if (resource.ami === "ami-0faefa03f7ddcd657") {
			if (!(resource.instance_type === "mac1.metal")) {
				return Promise.reject(
					new Error("Instance type for this ami must be mac1.metal")
				);
			}
		} else if (
			!/^[a-zA-Z][0-9].[a-zA-Z0-9]+$/.test(resource.instance_type)
		) {
			return Promise.reject(new Error("Invalid instance type"));
		}
	} else if (resource.type === "gce") {
		if (!hasAllKeys(resource, ["id", "machine_type", "disk_image"])) {
			return Promise.reject(new Error("Resource is missing keys"));
		}
		if (!/^[a-zA-Z][0-9]-[a-zA-Z0-9-]+$/.test(resource.machine_type)) {
			return Promise.reject(new Error("Invalid machine type"));
		}
		if (!/^[a-zA-Z0-9-]+$/.test(resource.disk_image)) {
			return Promise.reject(new Error("Invalid disk image"));
		}
		if (
			"location" in resource &&
			!/^[a-zA-Z]*-?[0-9]*$/.test(resource.location)
		) {
			return Promise.reject(new Error("Invalid resource location"));
		}
	} else if (resource.type === "googleStorageBucket") {
		if (!hasAllKeys(resource, ["id"])) {
			return Promise.reject(new Error("Resource is missing keys"));
		}
		if ("zone" in resource && !/^[a-zA-Z]*-?[0-9]*$/.test(resource.zone)) {
			return Promise.reject(new Error("Invalid resource zone"));
		}
	} else if (resource.type === "s3") {
		if (!hasAllKeys(resource, ["id"])) {
			return Promise.reject(new Error("Resource is missing keys"));
		}
		if (
			resource.acl &&
			!(resource.acl in ["private", "public-read", "public-read-write"])
		) {
			return Promise.reject(new Error("Invalid acl"));
		}
	} else if (resource.type === "lambdaFunction") {
		if (
			!hasAllKeys(resource, [
				"id",
				"functionName",
				"filename",
				"runtime",
				"handler"
			]) ||
			typeof resource.handler !== "string" ||
			!/^[a-zA-Z][a-zA-Z0-9_]+$/.test(resource.funtionName) ||
			!/^([a-zA-Z0-9_\\.]+|[a-zA-Z0-9_/.]+)[a-zA-Z0-9_]+\.zip$/.test(
				resource.filename
			) ||
			!isRuntime(resource.runtime)
		) {
			return Promise.reject(new Error("Invalid lambda function"));
		}
	} else if (resource.type === "glacierVault") {
		if (!hasAllKeys(resource, ["id"])) {
			return Promise.reject(new Error("Resource is missing keys"));
		}
	} else if (resource.type === "dynamoDb") {
		if (!hasAllKeys(resource, ["id", "attributes"])) {
			return Promise.reject(new Error("Resource is missing keys"));
		}
		if (!Array.isArray(resource.attributes)) {
			return Promise.reject(new Error(`Invalid attributes array`));
		}
		for (let i = 0; i < resource.attributes.length; i++) {
			if (!hasAllKeys(resource.attributes[i], ["name", "type"])) {
				return Promise.reject(
					new Error(`dynamo DB attribute ${i} is missing keys`)
				);
			}
			if (typeof resource.attributes[i].name !== "string") {
				return Promise.reject(
					new Error(`dynamo DB attribute ${i} has an invalid name`)
				);
			}
			if (!/^(S|N|B)$/.test(resource.attributes[i].type)) {
				return Promise.reject(
					new Error(`dynamo DB attribute ${i} has an invalid type`)
				);
			}
		}
		if (
			resource.attributes.filter((a: db_attribute) => a.isHash).length < 1
		) {
			return Promise.reject(
				new Error(`dynamo DB attributes have no hash`)
			);
		}
	}

	return Promise.resolve(true);
};

export default resourceValidator;
