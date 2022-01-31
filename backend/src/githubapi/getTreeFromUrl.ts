import axios from "axios";
import {createGithubHeader} from "./util";

export interface GithubTreeNode {
	path: string;
	mode: string;
	type: string;
	sha: string;
	size: number;
	url: string;
}

export interface GithubTree {
	sha: string;
	url: string;
	tree: GithubTreeNode[];
}

export default (token: string, treeUrl: string): Promise<GithubTree> =>
	new Promise<GithubTree>((resolve, reject) => {
		axios
			.get(treeUrl, createGithubHeader(token))
			.then(resp => {
				if (
					"sha" in resp.data &&
					"url" in resp.data &&
					"tree" in resp.data &&
					Array.isArray(resp.data.tree)
				) {
					const tree = {
						sha: resp.data.sha,
						url: resp.data.url,
						tree: resp.data.tree
					};
					if (
						tree.tree.reduce(
							(acc: boolean, repo: any) =>
								acc &&
								Object.values(repo).reduce(
									(acc2, prop2) =>
										acc2 &&
										prop2 !== undefined &&
										prop2 !== null
								),
							true
						)
					) {
						resolve(tree);
					} else {
						reject(new Error("Invalid response from github"));
					}
				} else {
					reject(new Error("Invalid response from github"));
				}
			})
			.catch(reject);
	});
