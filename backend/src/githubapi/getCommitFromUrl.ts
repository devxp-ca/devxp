import axios from "axios";
import {GithubCommit, isGithubCommit} from "../types/github";
import {createGithubHeader} from "./util";

export default (token: string, commitUrl: string): Promise<GithubCommit> =>
	new Promise<GithubCommit>((resolve, reject) => {
		axios
			.get(commitUrl, createGithubHeader(token))
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
