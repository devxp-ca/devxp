import {query} from "express-validator";
import {authorizationErrorHandler} from "../types/errorHandler";

export default [
	query("error").not().exists(),
	query("code").exists(),
	authorizationErrorHandler
];
