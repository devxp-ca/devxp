import {header, query} from "express-validator";
import {validationErrorHandler} from "../types/errorHandler";

export default [
	header("token")
		.exists()
		.trim()
		.escape()
		.isLength({min: 3})
		.withMessage("Invalid authorization token"),
	query("repo")
		.exists()
		.trim()
		.isLength({min: 3})
		.matches(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/)
		.withMessage("Invalid repo query param"),
	validationErrorHandler
];
