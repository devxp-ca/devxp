import {body, header} from "express-validator";
import {validationErrorHandler} from "../types/errorHandler";
import resourceValidator, {resourceTypes} from "./resourceValidator";

export const settingsValidator = [
	body("repo")
		.exists()
		.trim()
		.isLength({min: 3})
		.matches(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/),
	body("tool")
		.exists()
		.trim()
		.escape()
		.isLength({min: 3})
		.matches(/^(terraform|linter|pipeline)$/)
		.withMessage("Unknown Tool"),
	body("settings").exists().isObject(),
	body("settings.provider")
		.if(body("tool").equals("terraform"))
		.exists()
		.trim()
		.escape()
		.isLength({min: 1})
		.matches(/^(aws|google|azure)$/)
		.withMessage("Provider must be aws, google, or azure at this time"),
	body("settings.project")
		.if(body("tool").equals("terraform"))
		.if(body("settings.provider").equals("google"))
		.exists()
		.trim()
		.escape()
		.isLength({min: 1}),
	body("settings.resources")
		.if(body("tool").equals("terraform"))
		.optional()
		.isArray()
		.default([]),
	body("settings.resources.*.*")
		.if(body("tool").equals("terraform"))
		.trim()
		.escape()
		.isLength({min: 1}),
	body("settings.resources.*.type")
		.if(body("tool").equals("terraform"))
		.exists()
		.isLength({min: 1})
		.matches(resourceTypes),
	body("settings.resources.*.id")
		.if(body("tool").equals("terraform"))
		.optional()
		.trim()
		.escape()
		.isLength({min: 1})
		.matches(/^[a-zA-Z-_]+$/),
	body("settings.resources.*")
		.if(body("tool").equals("terraform"))
		.isObject()
		.custom(resourceValidator)
		.withMessage("Invalid settings for terraform resource"),
	header("token").exists().trim().escape().isLength({min: 3}),
	validationErrorHandler
];
