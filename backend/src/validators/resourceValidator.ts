import {CustomValidator} from "express-validator";

export const resourceTypes = /^(ec2|gce)$/;

const resourceValidator: CustomValidator = (resource: any) => {
	return true;
};

export default resourceValidator;
