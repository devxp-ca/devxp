import axios from "axios";
import {GithubCommit, isGithubCommit} from "../types/github";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";

export default (
	token: string,
	repo: string,
	treeSha: string,
	parentsSha: string[] | string,
	message: string
): Promise<GithubCommit> =>
	new Promise<GithubCommit>((resolve, reject) => {
		axios
			.post(
				`${GITHUB_BASE_URL}/repos/${repo}/git/commits`,
				{
					message,
					parents: Array.isArray(parentsSha)
						? parentsSha
						: [parentsSha],
					tree: treeSha
				},
				createGithubHeader(token)
			)
			.then(resp => {
				const commit = {
					commitSha: resp.data.sha,
					treeSha: resp.data.tree?.sha,
					treeUrl: resp.data.tree?.url
				};
				if (isGithubCommit(commit)) {
					resolve(commit);
				} else {
					reject(new Error("Invalid response from github"));
				}
			})
			.catch(reject);
	});
