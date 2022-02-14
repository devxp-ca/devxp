import {Request, Response} from "express";
import {internalErrorHandler} from "../types/errorHandler";

export default (req: Request, res: Response) => {
	console.dir(req);
	res.json(req.body);
};
