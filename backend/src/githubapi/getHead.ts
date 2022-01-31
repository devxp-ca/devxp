import axios from "axios";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";

export interface GithubReference {
	sha: string;
	url: string;
}

export default (
	token: string,
	repo: string,
	branch = "main"
): Promise<GithubReference> =>
	new Promise<GithubReference>((resolve, reject) => {
		axios
			.get(
				`${GITHUB_BASE_URL}/repos/${repo}/git/ref/heads/${branch}`,
				createGithubHeader(token)
			)
			.then(resp => {
				if (
					"object" in resp.data &&
					"sha" in resp.data.object &&
					"url" in resp.data.object
				) {
					resolve({
						sha: resp.data.object.sha,
						url: resp.data.object.url
					});
				} else {
					reject(new Error("Invalid response from github"));
				}
			})
			.catch(reject);
	});
