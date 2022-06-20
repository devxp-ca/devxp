import {Request, Response} from "express";
import {ResponseModal} from "../database/response";
import createBranch from "../githubapi/createBranch";
import createCommit from "../githubapi/createCommit";
import {createPullRequestGetUrl} from "../githubapi/createPullRequest";
import createTree from "../githubapi/createTree";
import getCommitFromUrl from "../githubapi/getCommitFromUrl";
import getHead from "../githubapi/getHead";
import getTreeFromUrl from "../githubapi/getTreeFromUrl";
import getUser from "../githubapi/getUser";
import postBlob from "../githubapi/postBlob";
import updateHead from "../githubapi/updateHead";
import {getModeNumber} from "../githubapi/util";
import {createJob, indentLines} from "../pipeline/pipeline";
import {internalErrorHandler} from "../types/errorHandler";
import {Job} from "../types/pipeline";

export const pipelineController = (
	req: Request,
	res: Response,
	preview = false
) => {
	const jobs = req.body.settings.jobs as Job[];

	let pipeline = `
name: 🖥️ DevXP Deployment Pipeline 🚀

on:
  push:
    branches:
      - main
      - "**/**.tf"
      - .github/workflows/devxp.yml

jobs:
`;

	jobs.forEach(job => {
		pipeline = `${pipeline}${indentLines(createJob(job), 2)}`;
	});

	if (preview) {
		res.json({
			preview: pipeline
		});
		return;
	}

	const repo = req.body.repo as string;
	const token = req.headers?.token as string;

	getHead(token, repo, "main")
		.then(async head => {
			//Create the new file data on the server
			const blob = await postBlob(token, repo, pipeline);

			// Create a new branch to post our commit to
			const branchName = "DevXP-Pipeline";
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
					path: `.github/workflows/devxp.yaml`,
					mode: getModeNumber("blob"),
					type: "blob",
					sha: blob.sha,
					url: blob.url
				}
			]);

			//Create a new commit referencing the new tree
			const newCommit = await createCommit(
				token,
				repo,
				newTree.sha,
				newBranch.sha,
				"DevXP: CI/CD Pipeline"
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
				"DevXP: CI/CD Pipeline",
				`Merge DevXP CI/CD Pipeline branch with main branch`
			);

			return {
				pullRequest: pr.html_url
			};
		})
		.then(async json => {
			const user = await getUser(token);
			const response = await new ResponseModal({
				...json,
				user: user.id,
				tool: "pipeline"
			}).save();
			res.json({
				response: response.id
			});
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
};
