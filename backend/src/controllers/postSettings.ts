import {Request, Response} from "express";
import {NotFoundError} from "../types/error";
import {createTerraformSettings} from "./terraform";

export default (req: Request, res: Response) => {
	if (req.body.tool == "terraform") {
		createTerraformSettings(req, res);
	} else {
		res.status(404).json(
			new NotFoundError(req.body.tool, req.originalUrl).toResponse()
		);
	}
};
