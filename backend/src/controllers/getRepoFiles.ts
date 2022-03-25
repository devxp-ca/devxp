import {Request, Response} from "express";
import getFiles from "../githubapi/getFiles";
import {internalErrorHandler} from "../types/errorHandler";

export const getRepoFiles = (req: Request, res: Response) => {
	getFiles(req.headers.token as string, req.query.repo as string)
		.then(files => {
			res.json({
				files
			});
		})
		.catch(() => {
			getFiles(
				req.headers.token as string,
				req.query.repo as string,
				"master"
			)
				.then(files => {
					res.json({
						files
					});
				})
				.catch(internalErrorHandler(req, res));
		});
};
