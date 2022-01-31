import {Request, Response} from "express";
import axios from "axios";
import CONFIG from "../config";
import {internalErrorHandler} from "../types/errorHandler";

//Controller to redirect the client to Github Oauth2
export const redirectToGithub = (_req: Request, res: Response): void => {
	res.redirect(
		`https://github.com/login/oauth/authorize?client_id=${
			CONFIG.GITHUB_CLIENT_ID
		}&scope=${CONFIG.GITHUB_SCOPES.reduce((acc, str) => `${acc}%20${str}`)}`
	);
};

//Callback which Github will redirect to on successful oauth
//Will contain the "code" query param (pre-validated)
//Needs to make an API call to github to retrieve an access/refresh token
//Currently just returns the tokens. TODO: Redirect back to frontend
export const callbackFromGithub = (req: Request, res: Response): void => {
	//Formulate API call to requst access token
	axios
		.post(
			`https://github.com/login/oauth/access_token`,
			{
				client_id: CONFIG.GITHUB_CLIENT_ID,
				client_secret: CONFIG.GITHUB_CLIENT_SECRET,
				code: req.query.code
			},
			{
				headers: {
					accept: "application/json"
				}
			}
		)
		.then(resp => {
			//Ensure tokens are actually present in response from github
			if ("access_token" in resp.data && "refresh_token" in resp.data) {
				//TODO: Redirect back to frontend
				res.json({
					token: resp.data.access_token,
					refresh: resp.data.refresh_token
				});
			} else {
				//This should never run, but just in case
				return Promise.reject(
					new Error(
						`${resp.data?.error ?? "GitHub Error"}: ${
							resp.data?.error_description ?? "an error occurred"
						}`
					)
				);
			}
		})
		.catch(internalErrorHandler(req, res));
};
