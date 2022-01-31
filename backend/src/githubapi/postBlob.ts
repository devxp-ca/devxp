import axios from "axios";
import {GITHUB_BASE_URL, createGithubHeader} from "./util";
import base64 from "base-64";
import utf8 from "utf8";
import {GithubBlob, isGithubBlob} from "../types/github";

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
				const blob = {
					sha: resp.data.sha,
					url: resp.data.url
				};
				if (isGithubBlob(blob)) {
					resolve(blob);
				} else {
					reject(new Error("Invalid response from github"));
				}
			})
			.catch(reject);
	});
