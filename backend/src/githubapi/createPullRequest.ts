/* eslint-disable prettier/prettier */
import axios from "axios";
import {GithubPR, isGithubPR} from "../types/github";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";

export const createPullRequestGetUrl = (
	head: string, // Name of branch where changes implemented
	base: string, // Name of branch we want to merge into
	token: string,
	repo: string
): Promise<GithubPR & {html_url: string}> =>
	new Promise<GithubPR & {html_url: string}>((resolve, reject) => {
		createPullRequest(head, base, token, repo)
			.then(resp0 => {
				axios
					.get(resp0.url, {
						headers: {
							Authorization: `token ${token}`,
							Accept: "application / vnd.github.v3 + json"
						}
					})
					.then(resp => {
						if ("html_url" in resp.data) {
							resolve({
								url: resp0.url,
								title: resp0.title,
								html_url: resp.data.html_url as string
							});
						} else {
							reject(new Error("Invalid response from github"));
						}
					})
					.catch(reject);
			})
			.catch(reject);
	});

const createPullRequest = (
	head: string, // Name of branch where changes implemented
	base: string, // Name of branch we want to merge into
	token: string,
	repo: string
): Promise<GithubPR> =>
	new Promise<GithubPR>((resolve, reject) => {
		const header = {
			headers: {
				Authorization: `token ${token}`,
				Accept: "application / vnd.github.v3 + json"
			}
		};
		axios
			.post(
				`${GITHUB_BASE_URL}/repos/${repo}/pulls`,
				{
					head: head,
					base: base,
					title: "DevXP Config",
					body: "Merge DevXP Config branch with main branch"
				},
				header
			)
			.catch(err => {
				//Try master
				if (base === "main") {
					return axios.post(
						`${GITHUB_BASE_URL}/repos/${repo}/pulls`,
						{
							head: head,
							base: "master",
							title: "DevXP Config",
							body: "Merge DevXP Config branch with main branch"
						},
						header
					);
				} else {
					return Promise.reject(err);
				}
			})
			.then(resp => {
				const pr = {
					url: resp.data.url,
					title: resp.data.title
				};
				if (isGithubPR(pr)) {
					resolve(pr);
				} else {
					reject(new Error("Invalid response from github"));
				}
			})
			.catch(async err => {
				// Check if a pull request already exists, and if so, update it
				try {
					// Get number of Pull Requests
					const pulls = await axios.get(
						`${GITHUB_BASE_URL}/repos/${repo}/pulls`
					);
					const pullNumber = pulls.data[0].number;

					// Update the most recent Pull Request with the new changes.
					const resp = await axios.patch(
						`${GITHUB_BASE_URL}/repos/${repo}/pulls/${pullNumber}`,
						{},
						createGithubHeader(token)
					);
					resolve(resp.data as GithubPR);
				} catch {
					console.log(err.response.data);
					reject(err);
				}
			});
	});

export default createPullRequest;
