import {Response} from "express";
import {Request} from "express-validator/src/base";
import {NamedAwsBackend} from "../terraform/awsBackend";
import {AwsProvider} from "../terraform/awsProvider";
import {Ec2} from "../terraform/ec2";
import {Gce} from "../terraform/gce";
import {NamedGoogleBackend} from "../terraform/googleBackend";
import {GoogleProvider} from "../terraform/googleProvider";
import {rootBlock} from "../terraform/terraform";
import {TerraformResource} from "../types/terraform";

export const createTerraformSettings = (req: Request, res: Response): void => {
	const provider = req.body.settings?.provider as "aws" | "google" | "azure";
	const resourcesRaw = req.body.settings?.resources as (TerraformResource & {
		type: "ec2" | "gce";
	})[];
	const repo = req.body.repo as string;

	const resources = resourcesRaw.map(resource => {
		if (resource.type == "ec2") {
			const ec2: Ec2 = resource as Ec2;
			return new Ec2(ec2.ami, ec2.instance_type, ec2.id);
		}
		//else if(resource.type == "gce"){
		else {
			const gce: Gce = resource as Gce;
			return new Gce(gce.id, gce.machine_type, gce.disk_image);
		}
	});

	res.json(
		rootBlock(
			provider === "aws" ? new AwsProvider() : new GoogleProvider(),
			provider === "aws"
				? new NamedAwsBackend()
				: new NamedGoogleBackend(),
			resources
		)
	);
};
