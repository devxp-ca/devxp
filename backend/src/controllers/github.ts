import {Request, Response} from "express";
import axios from "axios";
import CONFIG from "../config";
import {internalErrorHandler} from "../types/errorHandler";

export const redirectToGithub = (_req: Request, res: Response): void => {
	res.redirect(
		`https://github.com/login/oauth/authorize?client_id=${CONFIG.GITHUB_CLIENT_ID}`
	);
};

export const callbackFromGithub = (req: Request, res: Response): void => {
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
			if ("access_token" in resp.data) {
				res.json({
					token: resp.data.access_token
				});
			}
			return Promise.reject(
				new Error(
					`${resp.data?.error ?? "GitHub Error"}: ${
						resp.data?.error_description ?? "an error occurred"
					}`
				)
			);
		})
		.catch(internalErrorHandler(req, res));
};
