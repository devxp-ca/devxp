import {Request, Response, NextFunction} from "express";
import {AnalyticModal, AnalyticSchema} from "../database/analytics";
import getUser from "../githubapi/getUser";

export const submitPr = [
	async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
		getUser(req.headers.token as string)
			.then(profile => {
				let pullRequests = 0;
				AnalyticModal.findOne({
					repo: req.body.repo,
					user: profile.id
				})
					.then((results?: AnalyticSchema) => {
						if (results) {
							pullRequests = results.pullRequests;
						}
					})
					.catch(console.error)
					.finally(() => {
						AnalyticModal.updateOne(
							{
								repo: req.body.repo,
								user: profile.id,
								pullRequests: pullRequests
							},
							{upsert: true},
							() => {
								next();
							}
						);
					});
			})
			.catch(err => {
				//API request will prob fail at a later date, but that's another controllers problem
				console.error(err);
				next();
			});
	}
];
