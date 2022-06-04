import {Request} from "express";
import {TerraformResource} from "../types/terraform";
import {DynamoDb} from "./DynamoDb";
import {Ec2} from "./ec2";
import {Gce} from "./gce";
import {GlacierVault} from "./glacierVault";
import {GoogleCloudRun} from "./googleCloudRun";
import {GoogleFunction} from "./googleFunction";
import {GoogleStorageBucket} from "./googleStorageBucket";
import {lambdaFunction} from "./lambdaFunction";
import {S3} from "./s3";

export const reqToResources = (req: Request) => {
	const provider = req.body.settings?.provider as "aws" | "google" | "azure";
	//Only needed for google
	const project =
		provider === "google" ? (req.body.settings?.project as string) : "";
	return (
		(req.body.settings?.resources ?? []) as (TerraformResource & {
			type:
				| "ec2"
				| "gce"
				| "s3"
				| "glacierVault"
				| "lambdaFunc"
				| "dynamoDb"
				| "googleStorageBucket"
				| "googleFunc"
				| "cloudRun";
		})[]
	).map(resource =>
		objectToResource(resource, project)
	) as TerraformResource[];
};

export const objectToResource = (
	resource: TerraformResource & {
		type:
			| "ec2"
			| "gce"
			| "s3"
			| "glacierVault"
			| "lambdaFunc"
			| "dynamoDb"
			| "googleStorageBucket"
			| "googleFunc"
			| "cloudRun";
	},
	project = "UNKNOWN_ERROR"
) => {
	if (resource.type === "ec2") {
		const ec2: Ec2 = resource as Ec2;
		return new Ec2(ec2.ami, ec2.instance_type, ec2.id, ec2.autoIam);
	} else if (resource.type === "gce") {
		const gce: Gce = resource as Gce;
		return new Gce(project, gce.id, gce.machine_type, gce.disk_image);
	} else if (resource.type === "s3") {
		const s3: S3 = resource as S3;
		return new S3(s3.id, s3.autoIam);
	} else if (resource.type === "glacierVault") {
		const glacierVault: GlacierVault = resource as GlacierVault;
		return new GlacierVault(glacierVault.id, glacierVault.autoIam);
	} else if (resource.type === "dynamoDb") {
		const dynamoDb: DynamoDb = resource as DynamoDb;
		return new DynamoDb(dynamoDb.id, dynamoDb.attributes, dynamoDb.autoIam);
	} else if (resource.type === "lambdaFunc") {
		const lambdaFunc: lambdaFunction = resource as lambdaFunction;
		return new lambdaFunction(
			lambdaFunc.id,
			lambdaFunc.functionName,
			lambdaFunc.filename,
			lambdaFunc.runtime,
			lambdaFunc.handler,
			!!lambdaFunc.keepWarm,
			lambdaFunc.autoIam
		);
	} else if (resource.type === "googleStorageBucket") {
		const bucket: GoogleStorageBucket = resource as GoogleStorageBucket;
		return new GoogleStorageBucket(project, bucket.id, bucket.location);
	} else if (resource.type === "googleFunc") {
		const googleFunc: GoogleFunction = resource as GoogleFunction;
		return new GoogleFunction(
			project,
			googleFunc.id,
			googleFunc.runtime,
			googleFunc.entry_point,
			googleFunc.source_dir,
			googleFunc.trigger_http,
			googleFunc.memory,
			googleFunc.location
		);
	} else if (resource.type === "cloudRun") {
		const cloudRun: GoogleCloudRun = resource as GoogleCloudRun;
		return new GoogleCloudRun(
			project,
			cloudRun.id,
			cloudRun.image,
			cloudRun.env,
			cloudRun.domain,
			cloudRun.location
		);
	}
};
