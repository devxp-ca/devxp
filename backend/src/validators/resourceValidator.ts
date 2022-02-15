import {CustomValidator} from "express-validator";

export const resourceTypes = /^(ec2|gce)$/;

const hasAllKeys = (obj: any, keys: string[]) => {
	let retVal = true;
	keys.forEach(key => {
		if (!(key in obj)) {
			retVal = false;
		}
	});
	return retVal;
};

const resourceValidator: CustomValidator = (resource: any) => {
	if (resource.type === "ec2") {
		if (!hasAllKeys(resource, ["ami", "instance_type", "id"])) {
			return false;
		}
		if (!/^ami-[0-9a-zA-Z]+$/.test(resource.ami)) {
			return false;
		}
		if (!/^t2.[a-zA-Z]+$/.test(resource.instance_type)) {
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
		if ("zone" in resource && !/^[a-zA-Z]*-?[0-9]*$/.test(resource.zone)) {
			return false;
		}
	}

	return true;
};

export default resourceValidator;
