import {body, header} from "express-validator";
import {validationErrorHandler} from "../types/errorHandler";
import resourceValidator, {
	resourceTypes,
	uniquenessValidator
} from "./resourceValidator";

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
	body("settings.secure")
		.if(body("tool").equals("terraform"))
		.optional()
		.isBoolean()
		.default(false)
		.withMessage("secure flag must be boolean"),
	body("settings.allowSsh")
		.if(body("tool").equals("terraform"))
		.optional()
		.isBoolean()
		.default(false)
		.withMessage("allowSsh flag must be boolean"),
	body("settings.allowIngressWeb")
		.if(body("tool").equals("terraform"))
		.optional()
		.isBoolean()
		.default(false)
		.withMessage("allowIngressWeb flag must be boolean"),
	body("settings.allowEgressWeb")
		.if(body("tool").equals("terraform"))
		.optional()
		.isBoolean()
		.default(false)
		.withMessage("allowEgressWeb flag must be boolean"),
	body("settings.autoLoadBalance")
		.if(body("tool").equals("terraform"))
		.optional()
		.isBoolean()
		.default(false)
		.withMessage("autoLoadBalance flag must be boolean"),
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
		.default([])
		.custom(uniquenessValidator)
		.withMessage("Resource IDs must be unique"),
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
		.matches(/^[a-zA-Z-]+$/)
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
