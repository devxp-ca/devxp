import axios from "axios";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";

//Retrieve a suite of user info from an access token
export default (
	token: string,
	repo: string,
	branch = "main"
): Promise<string[]> =>
	new Promise<string[]>((resolve, reject) => {
		//api call
		axios
			.get(
				`${GITHUB_BASE_URL}/repos/${repo}/git/trees/${branch}?recursive=1`,
				createGithubHeader(token)
			)
			.then(resp => {
				if (Array.isArray(resp.data.tree)) {
					resolve(resp.data.tree.map((node: any) => node.path ?? ""));
				} else {
					reject(new Error("Invalid response from github"));
				}
			})
			.catch(reject);
	});
