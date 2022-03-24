import {Request, Response} from "express";
import createCommit from "../githubapi/createCommit";
import createTree from "../githubapi/createTree";
import createBranch from "../githubapi/createBranch";
import createPullRequest from "../githubapi/createPullRequest";
import getCommitFromUrl from "../githubapi/getCommitFromUrl";
import getHead from "../githubapi/getHead";
import getTreeFromUrl from "../githubapi/getTreeFromUrl";
import postBlob from "../githubapi/postBlob";
import updateHead from "../githubapi/updateHead";
import {getModeNumber} from "../githubapi/util";
import {NamedAwsBackend} from "../terraform/awsBackend";
import {AwsProvider} from "../terraform/awsProvider";
import {DynamoDb} from "../terraform/DynamoDb";
import {Ec2} from "../terraform/ec2";
import {Gce} from "../terraform/gce";
import {GlacierVault} from "../terraform/glacierVault";
import {NamedGoogleBackend} from "../terraform/googleBackend";
import {GoogleProvider} from "../terraform/googleProvider";
import {lambdaFunction} from "../terraform/lambdaFunction";
import {prefabNetworkFromArr, splitForPrefab} from "../terraform/prefab";
import {S3} from "../terraform/s3";
import {rootBlockSplitBackend} from "../terraform/terraform";
import {internalErrorHandler} from "../types/errorHandler";
import {TerraformResource} from "../types/terraform";
import {jsonToHcl} from "../util";
import {AwsLoadBalancer} from "../terraform/awsLoadBalancer";
import {GoogleStorageBucket} from "../terraform/googleStorageBucket";
import {GoogleFunction} from "../terraform/googleFunction";
import {GoogleCloudRun} from "../terraform/googleCloudRun";

export const createTerraformSettings = (req: Request, res: Response): void => {
	const provider = req.body.settings?.provider as "aws" | "google" | "azure";

	const secure = req.body.settings.secure ?? false;
	const allowSsh = req.body.settings.allowSsh ?? false;
	const allowEgressWeb = req.body.settings.allowEgressWeb ?? false;
	const allowIngressWeb = req.body.settings.allowIngressWeb ?? false;
	const autoLoadBalance = req.body.settings.autoLoadBalance ?? false;

	//Only needed for google
	const project =
		provider === "google" ? (req.body.settings?.project as string) : "";

	const resourcesRaw = req.body.settings?.resources as (TerraformResource & {
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
			return new S3(s3.id, s3.autoIam);
		} else if (resource.type === "glacierVault") {
			const glacierVault: GlacierVault = resource as GlacierVault;
			return new GlacierVault(glacierVault.id, glacierVault.autoIam);
		} else if (resource.type === "dynamoDb") {
			const dynamoDb: DynamoDb = resource as DynamoDb;
			return new DynamoDb(
				dynamoDb.id,
				dynamoDb.attributes,
				dynamoDb.autoIam
			);
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
		} else {
			flag = true;
		}
	}) as TerraformResource[];

	if (flag) {
		internalErrorHandler(req, res)(new Error("Unknown resource type"));
		return;
	}

	/* eslint-disable prefer-const */
	let [google, networkedResources] = splitForPrefab(resources);
	/* eslint-enable prefer-const */

	if (autoLoadBalance) {
		networkedResources = [
			...networkedResources,
			new AwsLoadBalancer(
				`http_load_balancer`,
				"TBD",
				"application",
				true,
				"TBD",
				"TBD",
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				"http-load-balancer"
			)
		];
	}

	const network =
		networkedResources.length > 0 && provider === "aws"
			? prefabNetworkFromArr(networkedResources, {
					allEgress: !secure,
					allIngress: !secure,
					ssh: secure && allowSsh,
					webEgress: secure && allowEgressWeb,
					webIngress: secure && allowIngressWeb
			  })
			: networkedResources;

	const [root, backend] = rootBlockSplitBackend(
		provider === "aws" ? new AwsProvider() : new GoogleProvider(project),
		provider === "aws"
			? new NamedAwsBackend()
			: new NamedGoogleBackend(project),
		[...google, ...network]
	);

	getHead(token, repo, "main")
		.then(async head => {
			//Create the new file data on the server
			const blobRoot = await postBlob(
				token,
				repo,
				jsonToHcl(root) + "\n"
			);

			/*
				Removed for M1 presentation. We'll solve the chicken and egg for milestone 2

			const blobBackend = await postBlob(
				token,
				repo,
				jsonToHcl(backend) + "\n"
			);
			*/

			// Create a new branch to post our commit to
			const branchName = "DevXP-Configuration";
			const newBranch = await createBranch(
				branchName,
				token,
				repo,
				head.sha
			);

			//Grab the latest commit at the head pointer
			const commit = await getCommitFromUrl(token, newBranch.url);

			//Grab the tree referenced by the commit
			const tree = await getTreeFromUrl(token, commit.treeUrl);

			//Create a new tree within that one
			const newTree = await createTree(token, repo, tree.sha, [
				{
					path: "terraform.tf",
					mode: getModeNumber("blob"),
					type: "blob",
					sha: blobRoot.sha,
					url: blobRoot.url
				}

				/*
				Removed for M1 presentation. We'll solve the chicken and egg for milestone 2
				{
					path: "backend.tf",
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
				newBranch.sha,
				"DevXP: Initialized Terraform"
			);
			//Update the HEAD pointer to the new commit
			const ref = await updateHead(
				token,
				repo,
				newCommit.commitSha,
				branchName
			);

			//Initiate a pull request to the main branch
			await createPullRequest("DevXP-Configuration", "main", token, repo);
			return ref;
		})
		.then(ref => {
			res.json({ref});
		})
		.catch(internalErrorHandler(req, res));
};
