import {Request, Response} from "express";
import createCommit from "../githubapi/createCommit";
import createTree from "../githubapi/createTree";
import createBranch from "../githubapi/createBranch";
import {createPullRequestGetUrl} from "../githubapi/createPullRequest";
import getCommitFromUrl from "../githubapi/getCommitFromUrl";
import getHead from "../githubapi/getHead";
import getTreeFromUrl from "../githubapi/getTreeFromUrl";
import postBlob from "../githubapi/postBlob";
import updateHead from "../githubapi/updateHead";
import {getModeNumber} from "../githubapi/util";
import {NamedAwsBackend} from "../terraform/awsBackend";
import {AwsProvider} from "../terraform/awsProvider";
import {NamedGoogleBackend} from "../terraform/googleBackend";
import {GoogleProvider} from "../terraform/googleProvider";
import {prefabNetworkFromArr, splitForPrefab} from "../terraform/prefab";
import {rootBlock} from "../terraform/terraform";
import {internalErrorHandler} from "../types/errorHandler";
import {providerName, TerraformResource} from "../types/terraform";
import {bucketExists, jsonToHcl} from "../util";
import {AwsLoadBalancer} from "../terraform/awsLoadBalancer";
import {BackendModel} from "../database/bucket";
import {reqToResources} from "../terraform/objectToResource";
import {GithubTreeNode} from "../types/github";

export const createTerraformSettings = (
	req: Request,
	res: Response,
	preview = false,
	bucketId?: string
): void => {
	const secure = req.body.settings.secure ?? false;
	const allowSsh = req.body.settings.allowSsh ?? false;
	const allowEgressWeb = req.body.settings.allowEgressWeb ?? false;
	const allowIngressWeb = req.body.settings.allowIngressWeb ?? false;
	const autoLoadBalance = req.body.settings.autoLoadBalance ?? false;

	const provider = req.body.settings?.provider as "aws" | "google" | "azure";
	//Only needed for google
	const project =
		provider === "google" ? (req.body.settings?.project as string) : "";

	const repo = req.body.repo as string;
	const token = req.headers?.token as string;

	const resources = reqToResources(req) as TerraformResource[];

	if (!resources.reduce((acc, nxt) => !!acc && !!nxt, true)) {
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
		networkedResources.length > 0 && provider === "aws" && secure
			? prefabNetworkFromArr(networkedResources, {
					allEgress: !secure,
					allIngress: !secure,
					ssh: secure && allowSsh,
					webEgress: secure && allowEgressWeb,
					webIngress: secure && allowIngressWeb
			  })
			: networkedResources;

	const namedBackend =
		provider === "aws"
			? new NamedAwsBackend(bucketId)
			: new NamedGoogleBackend(project, bucketId);

	const [root, backend] = rootBlock(
		provider === "aws" ? new AwsProvider() : new GoogleProvider(project),
		namedBackend,
		[...google, ...network]
	);

	if (preview) {
		let hcl =
			jsonToHcl(root) +
			"\n\n#Initialization setup\n\n" +
			jsonToHcl(backend) +
			"\n";
		hcl = hcl.replace(/terraform-state-[a-zA-Z0-9-_]+/, "RANDOM_ID");

		res.json({
			preview: hcl
		});
	} else {
		getHead(token, repo, "main")
			.then(async head => {
				//Create the new file data on the server
				const [devxpAlreadyInitialized, blobRoot, blobBackend] =
					await Promise.all([
						bucketExists(
							namedBackend.bucket,
							provider as providerName
						),
						postBlob(token, repo, jsonToHcl(root) + "\n"),
						postBlob(token, repo, jsonToHcl(backend) + "\n")
					]);

				// Create a new branch to post our commit to
				const branchName = !devxpAlreadyInitialized
					? "DevXP-Initialization"
					: "DevXP-Configuration";
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
				let files: GithubTreeNode[] = [
					{
						path: "backend.tf",
						mode: getModeNumber("blob"),
						type: "blob",
						sha: blobBackend.sha,
						url: blobBackend.url
					}
				];
				const terraformTF: GithubTreeNode = {
					path: "terraform.tf",
					mode: getModeNumber("blob"),
					type: "blob",
					sha: blobRoot.sha,
					url: blobRoot.url
				};
				if (devxpAlreadyInitialized) {
					files = [...files, terraformTF];
				}
				const newTree = await createTree(token, repo, tree.sha, files);

				//Create a new commit referencing the new tree
				const newCommit = await createCommit(
					token,
					repo,
					newTree.sha,
					newBranch.sha,
					!devxpAlreadyInitialized
						? "DevXP: Initialized Terraform"
						: "DevXP: Configured Terraform"
				);
				//Update the HEAD pointer to the new commit
				const ref = await updateHead(
					token,
					repo,
					newCommit.commitSha,
					branchName
				);
				//Initiate a pull request to the main branch
				const pr = await createPullRequestGetUrl(
					branchName,
					"main",
					token,
					repo,
					!devxpAlreadyInitialized
						? "DevXP Initialization"
						: "DevXP Config",
					`Merge DevXP ${
						!devxpAlreadyInitialized ? "Initialization" : "Config"
					} branch with main branch`,
					devxpAlreadyInitialized ? 0 : 1
				);

				//Update bucket
				await BackendModel.updateOne(
					{repo},
					{
						repo,
						provider,
						bucketId: namedBackend.bucket
					},
					{upsert: true}
				);

				if (!devxpAlreadyInitialized) {
					// Create a new branch to post our commit to
					const branchNameInit = "DevXP-Configuration";
					const newBranchInit = await createBranch(
						branchNameInit,
						token,
						repo,
						head.sha
					);

					const newTreeInit = await createTree(
						token,
						repo,
						tree.sha,
						terraformTF
					);

					//Create a new commit referencing the new tree
					const newCommitInit = await createCommit(
						token,
						repo,
						newTreeInit.sha,
						newBranchInit.sha,
						"DevXP: Configured Terraform"
					);
					//Update the HEAD pointer to the new commit
					const refInit = await updateHead(
						token,
						repo,
						newCommitInit.commitSha,
						branchNameInit
					);

					//Initiate a pull request to the main branch
					const prInit = await createPullRequestGetUrl(
						branchNameInit,
						"main",
						token,
						repo,
						"DevXP Configuration",
						"Merge DevXP Configuration branch with the main branch"
					);

					return {
						ref: refInit,
						pr: prInit,
						initialization: {
							ref,
							pr
						}
					};
				}
				return {
					ref,
					pr
				};
			})
			.then(json => {
				res.json(json);
			})
			.catch(err => {
				//If this error occures it's likely that the repo is empty
				internalErrorHandler(
					req,
					res
				)(
					new Error(
						`Failed to find last commit for:\n"${repo}"\nIs your repo empty? Repos must have atleast one file, such as a README or .gitignore`
					)
				);
			});
	}
};
