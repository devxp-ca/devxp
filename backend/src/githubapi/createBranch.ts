/* eslint-disable prettier/prettier */
import axios from "axios";
import {GithubBranch, isGithubBranch} from "../types/github";
import getHead from "./getHead";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";

export default (
	branchName: string,
	token: string,
	repo: string,
	treeSha: string
): Promise<GithubBranch> =>
	new Promise<GithubBranch>((resolve, reject) => {
		let errCache: any;

		axios
			.post(
				`${GITHUB_BASE_URL}/repos/${repo}/git/refs`,
				{
					sha: treeSha,
					ref: `refs/heads/${branchName}`
				},
				createGithubHeader(token)
			)
			.then(resp => {
				const branch = {
					sha: resp.data.object.sha,
					url: resp.data.object.url,
					type: resp.data.object.type
				};
				if (isGithubBranch(branch)) {
					resolve(branch);
				} else {
					reject(new Error("Invalid response from github"));
				}
			})
			.catch(err => {
				errCache = err;
				//Maybe the branch exists so we should try to retrieve it
				return getHead(token, repo, branchName);

				//TODO: Refactor this
			})
			.then(head => resolve(head as GithubBranch))
			.catch(() => {
				reject(errCache);
			});
	});
