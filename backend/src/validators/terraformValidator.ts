import {body, header} from "express-validator";
import {validationErrorHandler} from "../types/errorHandler";
import resourceValidator, {resourceTypes} from "./resourceValidator";

export const terraformValidator = [
	body("repo")
		.exists()
		.trim()
		.matches(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/),
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
		.matches(/^(aws|google|azure)$/)
		.withMessage("Provider must be aws, google, or azure at this time"),
	body("settings.resources").optional().isArray().default([]),
	body("settings.resources.*.*").trim().escape(),
	body("settings.resources.*.type").exists().matches(resourceTypes),
	body("settings.resources.*")
		.isObject()
		.custom(resourceValidator)
		.withMessage("Invalid settings for terraform resource"),
	header("token").exists().trim().escape(),
	validationErrorHandler
];
