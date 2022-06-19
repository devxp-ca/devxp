import {Request, Response} from "express";
import {ResponseModal} from "../database/response";
import getUser from "../githubapi/getUser";
import {NotFoundError, UnauthorizedError} from "../types/error";
import {internalErrorHandler} from "../types/errorHandler";
import {BaseResponse} from "../types/response";

export const getResponse = (req: Request, res: Response) => {
	const token = req.headers?.token as string;
	const id = req.params?.id as string;

	getUser(token)
		.then(user => {
			ResponseModal.findById(id, (err: Error, response: BaseResponse) => {
				if (err) return Promise.reject(err);
				if (!response) {
					res.status(404).json(
						new NotFoundError(id, req.originalUrl).toResponse()
					);
				} else if (response.user !== user.id) {
					res.status(401).json(
						new UnauthorizedError(req.originalUrl).toResponse()
					);
				} else {
					res.status(200).json({
						response
					});
				}
			});
		})
		.catch(internalErrorHandler(req, res));
};
