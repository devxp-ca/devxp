import {Request, Response} from "express";
import {NotFoundError} from "../types/error";
import {createTerraformSettings} from "./terraform";
import {internalErrorHandler} from "../types/errorHandler";
import {RepoSettings} from "../database/repoSettings";
import {BackendModel, backendSchemaType} from "../database/bucket";

export const postSettings = (req: Request, res: Response) => {
	if (req.body.tool == "terraform") {
		RepoSettings.updateOne(
			{repo: req.body.repo},
			{repo: req.body.repo, terraformSettings: req.body.settings},
			{upsert: true}
		)
			.then(result => {
				BackendModel.findOne(
					{repo: req.body.repo},
					(err: Error, results: backendSchemaType) => {
						if (err) {
							internalErrorHandler(req, res)(err);
						} else if (!results) {
							createTerraformSettings(req, res);
						} else {
							if (
								results.provider === req.body.settings.provider
							) {
								createTerraformSettings(
									req,
									res,
									results.bucketId
								);
							} else {
								createTerraformSettings(req, res);
							}
						}
					}
				);
			})
			.catch(err => {
				internalErrorHandler(req, res)(err);
			});
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
			} else if (!settings) {
				res.status(404).json(
					new NotFoundError(
						String(req.headers.repo),
						req.originalUrl
					).toResponse()
				);
			} else {
				if (
					"terraformSettings" in settings &&
					"resources" in settings.terraformSettings
				) {
					const json = settings.terraformSettings.toJSON();
					delete json._id;
					json.resources = json.resources.map((resource: any) => {
						delete resource._id;
						return resource;
					});

					res.json({
						settings: json
					});
				} else {
					internalErrorHandler(
						req,
						res
					)(new Error("Corrupted database entry"));
				}
			}
		}
	);
};
