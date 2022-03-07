import axios from "axios";
import {GithubReference, isGithubReference} from "../types/github";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";

const getHead = (
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
			.catch(async err => {
				if (branch === "main") {
					//Try master branch
					try {
						const head = await getHead(token, repo, "master");
						resolve(head);
					} catch {
						reject(err);
					}
				} else {
					reject(err);
				}
			});
	});

export default getHead;
