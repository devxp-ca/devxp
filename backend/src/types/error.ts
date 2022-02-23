import {ValidationError as ExpressValidationError} from "express-validator";
import hash from "object-hash";

// Point of this file is to create some predefined error
// types so that our API returns consistantly structured
// responses, even when there are errors. This will allow
// our frontend and even third party applications to
// better and more reliably integreate

export interface ErrorResponse {
	errors: BaseError[];
}

export default interface BaseError {
	//Datetime of error
	timestamp: Date;

	//HTTP Status
	status: number;

	//Error type / high level description
	error: string;

	//Path which created error
	path: string;

	//Detailed error message
	message?: string;

	//Utility functions for response formatting
	toArray: (array?: BaseError[]) => BaseError[];
	toResponse: (array?: BaseError[]) => ErrorResponse;

	//Method to remove extra attributes which shouldn't be returned to the user
	serialize: () => BaseError;
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
		const shas: Record<string, string> = {};
		return {
			errors: this.toArray(array)
				.map(err => err.serialize())
				.filter(err => {
					const sha = hash(err);
					if (!(sha in shas)) {
						shas[sha] = sha;
						return true;
					}
					return false;
				})
		};
	}

	serialize(): BaseError {
		return new BaseErrorImpl(
			this.error,
			this.path,
			this.status,
			this.message,
			this.timestamp
		);
	}
}

//For generic "something went wrong" type internal errors
export class InternalError extends BaseErrorImpl {
	constructor(err: Error, path: string) {
		super(err.name, path, 500, err.message);
	}
}

//404 class of error
export class NotFoundError extends BaseErrorImpl {
	constructor(resource: string, path: string) {
		super("Not Found", path, 404, `Failed to locate ${resource}`);
	}
}

//401 Unauthorized class of errors
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

//Errors thrown by our validation chains
//Stuff like a query parameter being formatted wrong
export class ValidationError extends BaseErrorImpl {
	nestedErrors: ValidationError[];

	constructor(err: ExpressValidationError[], path: string) {
		super(
			"Validation error",
			path,
			422,
			`${err[0].msg}: Parameter '${err[0].param}' was recieved as: ${err[0].value} `
		);

		this.nestedErrors =
			err.length > 1 ? err.map(e => new ValidationError([e], path)) : [];
	}

	toArray(array: BaseError[] = []): BaseError[] {
		return [...array, this, ...this.nestedErrors];
	}

	toResponse(array?: BaseError[]): ErrorResponse {
		const shas: Record<string, string> = {};
		return {
			errors: this.toArray(array)
				.map(err => err.serialize())
				.filter(err => {
					const sha = hash(err);
					if (!(sha in shas)) {
						shas[sha] = sha;
						return true;
					}
					return false;
				})
		};
	}
}
