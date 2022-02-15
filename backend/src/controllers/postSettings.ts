import {Request, Response} from "express";
import {internalErrorHandler} from "../types/errorHandler";

export default (req: Request, res: Response) => {
	console.dir(req);
	if (req.body.tool == "terraform") {
		/* TODO: Use existing code to write terraform file */
	} else {
		/* TODO: support more tools */
	}
	res.sendStatus(200);
};
