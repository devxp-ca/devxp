import axios from "axios";
import {GithubRepo, isGithubRepo} from "../types/github";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";

//Retrieve a list of github repos from an access token
export default (token: string): Promise<GithubRepo[]> =>
	new Promise<GithubRepo[]>(async (resolve, reject) => {
		let repoList: GithubRepo[] = [];
		let pageNum = 1;

		while (true) {
			try {
				//api call
				const resp = await axios.get(
					`${GITHUB_BASE_URL}/user/repos?per_page=100&page=${pageNum}`,
					createGithubHeader(token)
				);

				//extract the repos from the response
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
						repoList = [...repoList, ...repos];
					} else {
						reject(new Error("Invalid response from github"));
						break;
					}
				} else {
					reject(new Error("Invalid response from github"));
					break;
				}

				//find out if there is a next page
				//get the link header
				const linkHeader = resp.headers.link;
				//get the last page number
				if (linkHeader != null) {
					//if there is a link header, extract the last page number
					const nextPageRegex = /<.*(&page=\d*)>; rel="next"/;
					const nextPageMatch = linkHeader.match(nextPageRegex);
					if (nextPageMatch != null) {
						pageNum += 1;
					} else {
						resolve(repoList);
					}
				}
			} catch (err) {
				reject(err);
				break;
			}
		}
	});
