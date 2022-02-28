import axios from "axios";
import {GithubRepo, isGithubRepo} from "../types/github";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";

export default (token: string): Promise<GithubRepo[]> =>
	new Promise<GithubRepo[]>((resolve, reject) => {
		//we want to get the total number of pages of repos
		//so that in the frontend we can click the page buttons and have the correct number of pages
		let lastPageNumber = 1;
		axios
			.get(`${GITHUB_BASE_URL}/user/repos`, createGithubHeader(token)) //get the first page of repos
			.then(resp => {
				//check resp.headers.link for rel="last"
				//once we have the link, extract the page number using a regex
				//this will be the number of total pages of repos

				//get the link header
				const linkHeader = resp.headers.link;
				//get the last page number
				if (linkHeader != null) {
					//if there is a link header, extract the last page number
					const lastPageRegex = /<(.*)>; rel="last"/;
					const lastPageMatch = linkHeader.match(lastPageRegex);
					if (lastPageMatch != null) {
						console.dir(lastPageMatch);
						//if there is a match, extract the last page number
						lastPageNumber = parseInt(
							lastPageMatch[1].split("=")[1]
						);
					}
				}
				console.dir(lastPageNumber);
			})
			.catch(reject);
	});
