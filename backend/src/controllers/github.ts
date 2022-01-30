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
		.then(res => res.data["access_token"])
		.then(token => {
			console.dir(`Token: ${token}`);
			res.json({token});
		})
		.catch(internalErrorHandler(req, res));
};
