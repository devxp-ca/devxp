import axios from "axios";
import {GithubTree, GithubTreeNode, isGithubTree} from "../types/github";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";

export default (
	token: string,
	repo: string,
	treeSha: string,
	tree: GithubTreeNode[] | GithubTreeNode
): Promise<GithubTree> =>
	new Promise<GithubTree>((resolve, reject) => {
		axios
			.post(
				`${GITHUB_BASE_URL}/repos/${repo}/git/trees`,
				{
					base_tree: treeSha,
					tree: Array.isArray(tree) ? tree : [tree]
				},
				createGithubHeader(token)
			)
			.then(resp => {
				const tree = {
					sha: resp.data.sha,
					url: resp.data.url,
					tree: resp.data.tree
				};
				if (isGithubTree(tree)) {
					resolve(tree);
				} else {
					reject(new Error("Invalid response from github"));
				}
			})
			.catch(reject);
	});
