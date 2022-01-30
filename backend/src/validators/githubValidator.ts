import {query} from "express-validator";
import {authorizationErrorHandler} from "../types/errorHandler";

export const githubCodeValidator = [
	query("error").not().exists(),
	query("code").exists().trim().escape(),
	authorizationErrorHandler
];
