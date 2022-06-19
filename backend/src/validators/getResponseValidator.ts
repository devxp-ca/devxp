import {header, param} from "express-validator";
import {mongoose} from "../database/connection";
import {validationErrorHandler} from "../types/errorHandler";

export default [
	header("token")
		.exists()
		.trim()
		.escape()
		.isLength({min: 3})
		.withMessage("Invalid authorization token"),
	param("id")
		.exists()
		.trim()
		.custom((param: string) => mongoose.Types.ObjectId.isValid(param))
		.withMessage("Invalid response ID"),
	validationErrorHandler
];
