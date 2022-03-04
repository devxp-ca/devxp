import {CustomValidator} from "express-validator";
import {isRuntime} from "../types/terraform";

export const resourceTypes = /^(ec2|gce|s3|lambdaFunc)$/;

const validId = (id: string): boolean => {
	return /^[a-z]([-a-z0-9]*[a-z0-9])?$/.test(id);
};

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

const resourceValidator: CustomValidator = (resource: any) => {
	if (resource.type === "ec2") {
		if (!hasAllKeys(resource, ["ami", "instance_type", "id"])) {
			return false;
		}
		if (!/^ami-[0-9a-zA-Z]+$/.test(resource.ami)) {
			if (!/^AUTO_(UBUNTU|WINDOWS|AMAZON)$/.test(resource.ami)) {
				return false;
			}
		}

		//MAC Must use mac1.metal instance type
		if (resource.ami === "ami-0faefa03f7ddcd657") {
			if (!(resource.instance_type === "mac1.metal")) {
				return false;
			}
		} else if (!/^t2.[a-zA-Z]+$/.test(resource.instance_type)) {
			return false;
		}
		if (!validId(resource.id)) {
			return false;
		}
	} else if (resource.type === "gce") {
		if (!hasAllKeys(resource, ["id", "machine_type", "disk_image"])) {
			return false;
		}
		if (!/^[a-zA-Z][0-9]-[a-zA-Z0-9-]+$/.test(resource.machine_type)) {
			return false;
		}
		if (!/^[a-zA-Z0-9-]+$/.test(resource.disk_image)) {
			return false;
		}
		if (!validId(resource.id)) {
			return false;
		}
		if ("zone" in resource && !/^[a-zA-Z]*-?[0-9]*$/.test(resource.zone)) {
			return false;
		}
	} else if (resource.type === "s3") {
		if (!hasAllKeys(resource, ["id"])) {
			return false;
		}
		if (
			resource.acl &&
			!(resource.acl in ["private", "public-read", "public-read-write"])
		) {
			return false;
		}
		if (!validId(resource.id)) {
			return false;
		}
	} else if (resource.type === "lambdaFunction") {
		if (
			!hasAllKeys(resource, [
				"id",
				"functionName",
				"filename",
				"runtime"
			]) ||
			!validId(resource.id) ||
			!/^[a-zA-Z][a-zA-Z0-9_]+$/.test(resource.funtionName) ||
			!/^([a-zA-Z0-9_\\.]+|[a-zA-Z0-9_/.]+)[a-zA-Z0-9_]+\.zip$/.test(
				resource.filename
			) ||
			!isRuntime(resource.runtime)
		) {
			return false;
		}
	} else if (resource.type === "glacierVault") {
		if (!hasAllKeys(resource, ["id"])) {
			return false;
		}
		if (!/^[a-z][-a-z0-9]*[a-z0-9]$/.test(resource.id)) {
			return false;
		}
	}

	return true;
};

export default resourceValidator;
