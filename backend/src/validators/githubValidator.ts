import {query} from "express-validator";
import {validationErrorHandler} from "../types/errorHandler";

export const githubCodeValidator = [
	query("error").not().exists(),
	query("code").exists().trim().escape(),
	validationErrorHandler
];
