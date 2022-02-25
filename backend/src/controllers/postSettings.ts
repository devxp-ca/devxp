import {Request, Response} from "express";
import {NotFoundError} from "../types/error";
import {createTerraformSettings} from "./terraform";
import {
	terraformSettings,
	saveTerraformSettings
} from "../database/repoSettings";

export default (req: Request, res: Response) => {
	if (req.body.tool == "terraform") {
		saveTerraformSettings(
			req.body.repo as string,
			req.body.settings as terraformSettings
		);
		createTerraformSettings(req, res);
	} else {
		res.status(404).json(
			new NotFoundError(req.body.tool, req.originalUrl).toResponse()
		);
	}
};
