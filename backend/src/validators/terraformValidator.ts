import {body, header} from "express-validator";
import {validationErrorHandler} from "../types/errorHandler";

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
		.matches(/^[tT]erraform$/)
		.withMessage("Tool must be terraform for this endpoint"),
	body("settings").exists().isObject(),
	body("settings.provider")
		.exists()
		.trim()
		.escape()
		.matches(/^(aws|google|azure)$/),
	body("settings.resources").optional().isArray().default([]),
	header("token").exists().trim().escape(),
	validationErrorHandler
];
