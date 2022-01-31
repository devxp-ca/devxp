import axios from "axios";
import {GithubProfile, isGithubProfile} from "../types/github";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";

//Retrieve a suite of user info from an access token
export default (token: string): Promise<GithubProfile> =>
	new Promise<GithubProfile>((resolve, reject) => {
		//api call
		axios
			.get(`${GITHUB_BASE_URL}/user`, createGithubHeader(token))
			.then(resp => {
				//ensure required fields are really set
				const profile = {
					login: resp.data.login,
					id: resp.data.id,
					name: resp.data.name,
					avatar_url: resp.data.avatar_url
				};
				if (isGithubProfile(profile)) {
					resolve(profile);
				} else {
					reject(new Error("Invalid response from github"));
				}
			})
			.catch(reject);
	});
