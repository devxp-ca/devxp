import axios from "axios";
import {createGithubHeader} from "./util";

export interface GithubCommit {
	commitSha: string;
	treeSha: string;
	treeUrl: string;
}

export default (token: string, commitUrl: string): Promise<GithubCommit> =>
	new Promise<GithubCommit>((resolve, reject) => {
		axios
			.get(commitUrl, createGithubHeader(token))
			.then(resp => {
				if (
					"sha" in resp.data &&
					"tree" in resp.data &&
					"sha" in resp.data.tree &&
					"url" in resp.data.tree
				) {
					resolve({
						commitSha: resp.data.sha,
						treeSha: resp.data.tree.sha,
						treeUrl: resp.data.tree.url
					});
				} else {
					reject(new Error("Invalid response from github"));
				}
			})
			.catch(reject);
	});
