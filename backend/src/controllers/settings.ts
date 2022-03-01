import {Request, Response} from "express";
import {NotFoundError} from "../types/error";
import {createTerraformSettings} from "./terraform";
import {internalErrorHandler} from "../types/errorHandler";
import {RepoSettings} from "../database/repoSettings";

export const postSettings = (req: Request, res: Response) => {
	if (req.body.tool == "terraform") {
		RepoSettings.updateOne(
			{repo: req.body.repo},
			{repo: req.body.repo, terraformSettings: req.body.settings},
			{upsert: true}
		)
			.then(result => {
				console.log(result);
			})
			.catch(err => {
				internalErrorHandler(req, res)(err);
			});

		createTerraformSettings(req, res);
	} else {
		res.status(404).json(
			new NotFoundError(req.body.tool, req.originalUrl).toResponse()
		);
	}
};

export const getSettings = (req: Request, res: Response) => {
	RepoSettings.findOne(
		{repo: req.headers.repo},
		(err: Error, settings: any) => {
			if (err) {
				internalErrorHandler(req, res)(err);
			} else {
				res.json(settings);
			}
		}
	);
};
