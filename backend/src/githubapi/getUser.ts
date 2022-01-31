import axios from "axios";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";

//Relevant data we want to keep about a user
//This may and prob will change over time
export interface GithubProfile {
	login: string;
	id: number;
	name: string;
	avatar_url: string;
}

//Retrieve a suite of user info from an access token
export default (token: string): Promise<GithubProfile> =>
	new Promise<GithubProfile>((resolve, reject) => {
		//api call
		axios
			.get(`${GITHUB_BASE_URL}/user`, createGithubHeader(token))
			.then(resp => {
				//ensure required fields are really set
				if (
					"login" in resp.data &&
					"id" in resp.data &&
					"name" in resp.data &&
					"avatar_url" in resp.data
				) {
					resolve({
						login: resp.data.login,
						id: resp.data.id,
						name: resp.data.name,
						avatar_url: resp.data.avatar_url
					} as GithubProfile);
				} else {
					reject(new Error("Invalid response from github"));
				}
			})
			.catch(reject);
	});
