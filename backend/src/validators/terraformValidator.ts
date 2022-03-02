import {body, header} from "express-validator";
import {validationErrorHandler} from "../types/errorHandler";
import resourceValidator, {resourceTypes} from "./resourceValidator";

export const settingsValidator = [
	body("repo")
		.exists()
		.trim()
		.isLength({min: 3})
		.matches(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/)
		.withMessage("Invalid repo. Must match the form {NAME}/{REPO}."),
	body("tool")
		.exists()
		.trim()
		.escape()
		.isLength({min: 3})
		.matches(/^(terraform|linter|pipeline)$/)
		.withMessage("Unknown Tool"),
	body("settings")
		.exists()
		.isObject()
		.withMessage("Settings object must be provided"),
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
		.isLength({min: 1})
		.withMessage(
			"When using the provider 'google', the google project id must be provided"
		),
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
		.matches(resourceTypes)
		.withMessage("Invalid resource type"),
	body("settings.resources.*.autoIam")
		.if(body("tool").equals("terraform"))
		.optional()
		.isBoolean()
		.default(false)
		.withMessage("Invalid autoIam boolean"),
	body("settings.resources.*.id")
		.if(body("tool").equals("terraform"))
		.optional()
		.trim()
		.escape()
		.isLength({min: 1})
		.matches(/^[a-zA-Z-_]+$/)
		.withMessage(
			"Invalid resource ID. Only letters, dashes, and underscores are allowed"
		),
	body("settings.resources.*")
		.if(body("tool").equals("terraform"))
		.isObject()
		.custom(resourceValidator)
		.withMessage(value => `Invalid terraform resource "${value}"`),
	header("token")
		.exists()
		.trim()
		.escape()
		.isLength({min: 3})
		.withMessage("Invalid authorization token"),
	validationErrorHandler
];
