import axios from "axios";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";
import base64 from "base-64";
import utf8 from "utf8";

export interface GithubBlob {
	sha: string;
	url: string;
}

export default (
	token: string,
	repo: string,
	content: string
): Promise<GithubBlob> =>
	new Promise<GithubBlob>((resolve, reject) => {
		axios
			.post(
				`${GITHUB_BASE_URL}/repos/${repo}/git/blobs`,
				{
					content: base64.encode(utf8.encode(content)),
					encoding: "base64"
				},
				createGithubHeader(token)
			)
			.then(resp => {
				if ("sha" in resp.data && "url" in resp.data) {
					resolve({
						sha: resp.data.sha,
						url: resp.data.url
					});
				} else {
					reject(new Error("Invalid response from github"));
				}
			});
	});
