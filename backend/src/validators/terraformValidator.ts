import {body, header} from "express-validator";
import {validationErrorHandler} from "../types/errorHandler";
import resourceValidator, {resourceTypes} from "./resourceValidator";

export const settingsValidator = [
	body("repo")
		.exists()
		.trim()
		.matches(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/),
	body("tool")
		.exists()
		.trim()
		.escape()
		.matches(/^(terraform|linter|pipeline)$/)
		.withMessage("Unknown Tool"),
	body("settings").exists().isObject(),
	body("settings.provider")
		.if(body("tool").equals("terraform"))
		.exists()
		.trim()
		.escape()
		.matches(/^(aws|google|azure)$/)
		.withMessage("Provider must be aws, google, or azure at this time"),
	body("settings.resources")
		.if(body("tool").equals("terraform"))
		.optional()
		.isArray()
		.default([]),
	body("settings.resources.*.*")
		.if(body("tool").equals("terraform"))
		.trim()
		.escape(),
	body("settings.resources.*.type")
		.if(body("tool").equals("terraform"))
		.exists()
		.matches(resourceTypes),
	body("settings.resources.*")
		.if(body("tool").equals("terraform"))
		.isObject()
		.custom(resourceValidator)
		.withMessage("Invalid settings for terraform resource"),
	header("token").exists().trim().escape(),
	validationErrorHandler
];
