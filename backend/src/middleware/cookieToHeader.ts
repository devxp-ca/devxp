import {Request, Response, NextFunction} from "express";
import {header} from "express-validator";

// Ensures that any requests coming without a token set
// in the authorization header, but with the correct cookies
// set will still be accpeted. Will make the frontend side of
// communication much easier
export default [
	(req: Request, _res: Response, next: NextFunction): void => {
		if (!req.header("token") && req.cookies.token) {
			req.headers.token = String(req.cookies.token);
		}
		next();
	},
	header("token")
		.optional()
		.isString()
		.escape()
		.trim()
		.withMessage("AGHHHHHHHH")
];
