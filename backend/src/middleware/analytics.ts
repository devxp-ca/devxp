import {Request, Response, NextFunction} from "express";
import {AnalyticModal, AnalyticSchema} from "../database/analytics";
import getUser from "../githubapi/getUser";

export const submitPr = [
	async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
		if (req.body.preview) {
			next();
		} else {
			getUser(req.headers.token as string)
				.then(profile => {
					AnalyticModal.findOne({
						repo: req.body.repo,
						user: profile.login
					})
						.then(async (results?: AnalyticSchema) => {
							if (results) {
								AnalyticModal.updateOne(
									{
										repo: req.body.repo,
										user: profile.login,
										pullRequests: results.pullRequests + 1
									},
									() => next()
								);
							} else {
								new AnalyticModal({
									repo: req.body.repo,
									user: profile.login,
									pullRequests: 1
								}).save();
							}
						})
						.catch(_err => {
							new AnalyticModal({
								repo: req.body.repo,
								user: profile.login,
								pullRequests: 1
							}).save();
							next();
						});
				})
				.catch(err => {
					//API request will prob fail at a later date, but that's another controllers problem
					console.error(err);
					next();
				});
		}
	}
];
