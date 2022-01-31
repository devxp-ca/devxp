import axios from "axios";
import {GithubReference, isGithubReference} from "../types/github";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";

export default (
	token: string,
	repo: string,
	commitSha: string,
	branch = "main"
): Promise<GithubReference> =>
	new Promise<GithubReference>((resolve, reject) => {
		axios
			.patch(
				`${GITHUB_BASE_URL}/repos/${repo}/git/refs/heads/${branch}`,
				{
					sha: commitSha
				},
				createGithubHeader(token)
			)
			.then(resp => {
				const ref = {
					sha: resp.data.object?.sha,
					url: resp.data.object?.url
				};
				if (isGithubReference(ref)) {
					resolve(ref);
				} else {
					reject(new Error("Invalid response from github"));
				}
			})
			.catch(reject);
	});
