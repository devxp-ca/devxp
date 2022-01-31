import {Request, Response, NextFunction} from "express";

// Ensures that any requests coming without a token set
// in the authorization header, but with the correct cookies
// set will still be accpeted. Will make the frontend side of
// communication much easier
export default [
	(req: Request, _res: Response, next: NextFunction): void => {
		if (!req.header("token") && req.cookies.github_auth_token) {
			req.headers.token = String(req.cookies.github_auth_token);
		}
		next();
	}
];
