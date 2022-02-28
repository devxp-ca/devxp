import {Request, Response} from "express";
import getRepoPages from "../githubapi/getRepoPages";
import {internalErrorHandler} from "../types/errorHandler";

export const getNumRepoPages = (req: Request, res: Response) => {
	getRepoPages(req.headers.token as string)
		.then(lastPageNumber => {
			res.json({
				lastPageNumber
			});
		})
		.catch(internalErrorHandler(req, res));
};
