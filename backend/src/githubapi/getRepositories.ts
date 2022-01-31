import axios from "axios";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";

export interface GithubRepo {
	id: number;
	name: string;
	full_name: string;
	description: string;
	url: string;
	html_url: string;
	forks_count: number;
	stargazers_count: number;
	visibility: string;
}

export default (token: string): Promise<GithubRepo[]> =>
	new Promise<GithubRepo[]>((resolve, reject) => {
		axios
			.get(`${GITHUB_BASE_URL}/user/repos`, createGithubHeader(token))
			.then(resp => {
				if (Array.isArray(resp.data)) {
					//Extract relavent info
					const repos = resp.data.map(repo => ({
						id: repo.id,
						name: repo.name,
						full_name: repo.full_name,
						description: repo.description,
						url: repo.url,
						html_url: repo.html_url,
						forks_count: repo.forks_count,
						stargazers_count: repo.stargazers_count,
						visibility: repo.visibility
					}));

					//Ensure no properties are undefined
					if (
						repos.reduce(
							(acc, repo) =>
								acc &&
								Object.values(repo).reduce(
									(acc2, prop2) => acc2 && !!prop2
								)
						)
					) {
						resolve(repos as GithubRepo[]);
					} else {
						reject(new Error("Invalid response from github"));
					}
				} else {
					reject(new Error("Invalid response from github"));
				}
			})
			.catch(reject);
	});
