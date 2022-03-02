import {Request, Response} from "express";
import createCommit from "../githubapi/createCommit";
import createTree from "../githubapi/createTree";
import getCommitFromUrl from "../githubapi/getCommitFromUrl";
import getHead from "../githubapi/getHead";
import getTreeFromUrl from "../githubapi/getTreeFromUrl";
import postBlob from "../githubapi/postBlob";
import updateHead from "../githubapi/updateHead";
import {getModeNumber} from "../githubapi/util";
import {NamedAwsBackend} from "../terraform/awsBackend";
import {AwsProvider} from "../terraform/awsProvider";
import {Ec2} from "../terraform/ec2";
import {Gce} from "../terraform/gce";
import {NamedGoogleBackend} from "../terraform/googleBackend";
import {GoogleProvider} from "../terraform/googleProvider";
import {S3} from "../terraform/s3";
import {rootBlockSplitBackend} from "../terraform/terraform";
import {internalErrorHandler} from "../types/errorHandler";
import {TerraformResource} from "../types/terraform";

export const createTerraformSettings = (req: Request, res: Response): void => {
	const provider = req.body.settings?.provider as "aws" | "google" | "azure";

	//Only needed for google
	const project =
		provider === "google" ? (req.body.settings?.project as string) : "";

	const resourcesRaw = req.body.settings?.resources as (TerraformResource & {
		type: "ec2" | "gce" | "s3";
	})[];
	const repo = req.body.repo as string;
	const token = req.headers?.token as string;

	let flag = false;

	const resources = resourcesRaw.map(resource => {
		if (resource.type === "ec2") {
			const ec2: Ec2 = resource as Ec2;
			return new Ec2(ec2.ami, ec2.instance_type, ec2.id, ec2.autoIam);
		} else if (resource.type === "gce") {
			const gce: Gce = resource as Gce;
			return new Gce(project, gce.id, gce.machine_type, gce.disk_image);
		} else if (resource.type === "s3") {
			const s3: S3 = resource as S3;
			return new S3(s3.id, s3.autoIam, s3.acl);
		} else {
			flag = true;
		}
	}) as TerraformResource[];

	if (flag) {
		internalErrorHandler(req, res)(new Error("Unknown resource type"));
		return;
	}

	const [root, backend] = rootBlockSplitBackend(
		provider === "aws" ? new AwsProvider() : new GoogleProvider(project),
		provider === "aws"
			? new NamedAwsBackend()
			: new NamedGoogleBackend(project),
		resources
	);

	getHead(token, repo, "main")
		.then(async head => {
			//Create the new file data on the server
			const blobRoot = await postBlob(
				token,
				repo,
				JSON.stringify(root, null, 2) + "\n"
			);

			/*
				Removed for M1 presentation. We'll solve the chicken and egg for milestone 2

			const blobBackend = await postBlob(
				token,
				repo,
				JSON.stringify(backend, null, 2) + "\n"
			);
			*/

			//Grab the latest commit at the head pointer
			const commit = await getCommitFromUrl(token, head.url);

			//Grab the tree referenced by the commit
			const tree = await getTreeFromUrl(token, commit.treeUrl);

			//Create a new tree within that one
			const newTree = await createTree(token, repo, tree.sha, [
				{
					path: "terraform.tf.json",
					mode: getModeNumber("blob"),
					type: "blob",
					sha: blobRoot.sha,
					url: blobRoot.url
				}

				/*
				Removed for M1 presentation. We'll solve the chicken and egg for milestone 2
				{
					path: "backend.tf.json",
					mode: getModeNumber("blob"),
					type: "blob",
					sha: blobBackend.sha,
					url: blobBackend.url
				}
				*/
			]);

			//Create a new commit referencing the new tree
			const newCommit = await createCommit(
				token,
				repo,
				newTree.sha,
				head.sha,
				"DevXP: Initialized Terraform"
			);

			//Update the HEAD pointer to the new commit
			return updateHead(token, repo, newCommit.commitSha, "main");
		})
		.then(ref => {
			res.json({ref});
		})
		.catch(internalErrorHandler(req, res));
};
