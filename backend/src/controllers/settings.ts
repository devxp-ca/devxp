import {Request, Response} from "express";
import {NotFoundError} from "../types/error";
import {createTerraformSettings} from "./terraform";
import {internalErrorHandler} from "../types/errorHandler";
import {RepoSettings} from "../database/repoSettings";
import {BackendModel, backendSchemaType} from "../database/bucket";
import {TerraformResource} from "../types/terraform";
import {reqToResources} from "../terraform/objectToResource";

export const postSettings = (req: Request, res: Response) => {
	if (req.body.preview) {
		createTerraformSettings(req, res, true);
	} else if (req.body.tool == "terraform") {
		const resources = reqToResources(req) as TerraformResource[];
		if (!resources.reduce((acc, nxt) => !!acc && !!nxt, true)) {
			internalErrorHandler(req, res)(new Error("Unknown resource type"));
			return;
		}

		RepoSettings(resources)
			.updateOne(
				{repo: req.body.repo},
				{repo: req.body.repo, terraformSettings: req.body.settings},
				{upsert: true}
			)
			.then(() => {
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
									false,
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
	const resources = reqToResources(req) as TerraformResource[];
	if (!resources.reduce((acc, nxt) => !!acc && !!nxt, true)) {
		internalErrorHandler(req, res)(new Error("Unknown resource type"));
		return;
	}

	RepoSettings(resources).findOne(
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
