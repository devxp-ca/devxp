import {body, header} from "express-validator";
import {authorizationErrorHandler} from "../types/errorHandler";

export const terraformValidator = [
	body("repo")
		.exists()
		.trim()
		.escape()
		.matches(/^[A-Za-z0-9_.-]+$/),
	body("tool")
		.exists()
		.trim()
		.escape()
		.matches(/^[tT]erraform$/),
	header("token").exists().trim().escape(),
	authorizationErrorHandler
];
