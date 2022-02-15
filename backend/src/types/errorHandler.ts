import {NextFunction, Request, Response} from "express";
import {InternalError, ValidationError} from "../types/error";
import {validationResult} from "express-validator";

export type ErrorHandler = (
	_req: Request,
	_res: Response,
	_next?: NextFunction
) => (_err: Error) => void;

export type ValidationErrorHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => Response | undefined;

export const internalErrorHandler: ErrorHandler =
	(req: Request, res: Response) =>
	(err: Error): void => {
		res.status(500).json(
			new InternalError(err, req.originalUrl).toResponse()
		);
	};

export const validationErrorHandler: ValidationErrorHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res
			.status(422)
			.json(
				new ValidationError(
					errors.array(),
					req.originalUrl
				).toResponse()
			);
	}
	next();
};
