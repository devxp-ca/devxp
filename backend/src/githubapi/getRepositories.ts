import axios from "axios";
import {GithubRepo, isGithubRepo} from "../types/github";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";

//Retrieve a list of github repos from an access token
export default (token: string): Promise<GithubRepo[]> =>
	new Promise<GithubRepo[]>((resolve, reject) => {
		//api call
		axios
			.get(`${GITHUB_BASE_URL}/user/repos`, createGithubHeader(token))
			.then(resp => {
				if (Array.isArray(resp.data)) {
					//Extract relavent info
					const repos = resp.data.map(repo => ({
						id: repo.id,
						name: repo.name,
						full_name: repo.full_name,
						description: repo.description ?? "No description",
						url: repo.url,
						html_url: repo.html_url,
						forks_count: repo.forks_count,
						stargazers_count: repo.stargazers_count,
						visibility: repo.visibility
					}));

					//Ensure no properties are undefined
					if (
						repos.reduce(
							(acc: boolean, repo) => acc && isGithubRepo(repo),
							true
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
