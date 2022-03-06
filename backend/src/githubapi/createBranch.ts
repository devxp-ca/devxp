/* eslint-disable prettier/prettier */
import axios from "axios";
import {GithubBranch, isGithubBranch} from "../types/github";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";

export default (
	ref: string,
	token: string,
	repo: string,
	treeSha: string
): Promise<GithubBranch> =>
	new Promise<GithubBranch>((resolve, reject) => {
		axios
			.post(
				`${GITHUB_BASE_URL}/repos/${repo}/git/refs`,
				{
					sha: treeSha,
					ref: ref
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
			.catch(reject);
	});
