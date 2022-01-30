import {
	ValidationError as ExpressValidationError,
	Result as ExpressResult
} from "express-validator";

export interface ErrorResponse {
	errors: BaseError[];
}

export default interface BaseError {
	status: number;
	timestamp: Date;
	error: string;
	path: string;
	message?: string;
	toArray: (array?: BaseError[]) => BaseError[];
	toResponse: (array?: BaseError[]) => ErrorResponse;
}

export class BaseErrorImpl implements BaseError {
	status: number;
	timestamp: Date;
	error: string;
	path: string;
	message?: string;

	constructor(
		error: string,
		path: string,
		status: number,
		message?: string,
		timestamp: Date = new Date()
	) {
		this.error = error;
		this.path = path;
		this.message = message;
		this.status = status;
		this.timestamp = timestamp;
	}

	toArray(array: BaseError[] = []): BaseError[] {
		return [...array, this];
	}

	toResponse(array?: BaseError[]): ErrorResponse {
		return {
			errors: this.toArray(array)
		};
	}
}

export class InternalError extends BaseErrorImpl {
	constructor(err: Error, path: string) {
		super(err.name, path, 500, err.message);
	}
}

export class NotFoundError extends BaseErrorImpl {
	constructor(resource: string, path: string) {
		super("Not Found", path, 404, `Failed to locate ${resource}`);
	}
}

export class UnauthorizedError extends BaseErrorImpl {
	constructor(path: string) {
		super(
			"Unauthorized",
			path,
			401,
			"You are not authorized to access this resource"
		);
	}
}

export class ValidationError extends BaseErrorImpl {
	nestedErrors: ValidationError[];

	constructor(
		err: ExpressValidationError | ExpressResult<ExpressValidationError>,
		path: string
	) {
		super(
			"Validation error",
			path,
			422,
			String(
				"msg" in err
					? err.msg
					: "An error occured validating a parameter"
			)
		);

		this.nestedErrors =
			"param" in err && err.param === "_error"
				? (err.nestedErrors as ExpressValidationError[]).map(
						nestedErr => new ValidationError(nestedErr, path)
				  )
				: [];
	}

	toArray(array: BaseError[] = []): BaseError[] {
		return [...array, this, ...this.nestedErrors];
	}

	toResponse(array?: BaseError[]): ErrorResponse {
		return {
			errors: this.toArray(array)
		};
	}
}
