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
import {rootBlockSplitBackend} from "../terraform/terraform";
import {internalErrorHandler} from "../types/errorHandler";
import {TerraformResource} from "../types/terraform";
import {backendToHcl, jsonToHcl} from "../util";
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

	//TODO: Leave this as just rootBlock()
	// Solve chicken and egg problem
	const namedBackend =
		provider === "aws"
			? new NamedAwsBackend(bucketId)
			: new NamedGoogleBackend(project, bucketId);

	const [root, backend] = rootBlockSplitBackend(
		provider === "aws" ? new AwsProvider() : new GoogleProvider(project),
		namedBackend,
		[...google, ...network]
	);

	if (!root) {
		return internalErrorHandler(
			req,
			res
		)(new Error("Something went wrong generating terraform code"));
	}

	if (preview) {
		let hcl = jsonToHcl(root) + "\n";

		hcl = hcl.replace(/terraform-state-[a-zA-Z0-9-_]+/, "RANDOM_ID");

		res.json({
			preview: hcl
		});
	} else {
		getHead(token, repo, "main")
			.then(async head => {
				//Create the new file data on the server
				const blobRoot = await postBlob(
					token,
					repo,
					jsonToHcl(root) + "\n"
				);

				const blobBackend = backend
					? await postBlob(token, repo, backendToHcl(backend)).catch(
							console.error
					  )
					: undefined;

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

				let trees: GithubTreeNode[] = [
					{
						path: "terraform.tf",
						mode: getModeNumber("blob"),
						type: "blob",
						sha: blobRoot.sha,
						url: blobRoot.url
					}
				];
				if (blobBackend) {
					trees = [
						...trees,
						{
							path: "backend.tf",
							mode: getModeNumber("blob"),
							type: "blob",
							sha: blobBackend.sha,
							url: blobBackend.url
						}
					];
				}

				//Create a new tree within that one
				const newTree = await createTree(token, repo, tree.sha, trees);

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
				const pr = await createPullRequestGetUrl(
					"DevXP-Configuration",
					"main",
					token,
					repo
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
