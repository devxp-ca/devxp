import axios from "axios";
import {GithubTree, isGithubTree} from "../types/github";
import {createGithubHeader} from "./util";

export default (token: string, treeUrl: string): Promise<GithubTree> =>
	new Promise<GithubTree>((resolve, reject) => {
		axios
			.get(treeUrl, createGithubHeader(token))
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
