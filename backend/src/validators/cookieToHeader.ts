import {Request, Response, NextFunction} from "express";

export default [
	(req: Request, _res: Response, next: NextFunction): void => {
		if (!req.header("token") && req.cookies.github_auth_token) {
			req.headers.token = String(req.cookies.github_auth_token);
		}
		next();
	}
];
