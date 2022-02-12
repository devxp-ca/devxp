import {Request, Response} from "express";
import getRepos from "../githubapi/getRepositories";
import { internalErrorHandler } from "../types/errorHandler";

export const getRepoList = (req: Request, res: Response) => {
    console.log(req.headers.authorization as string);
   getRepos(req.headers.authorization as string).then(
        repos => {
            res.json({
                repos
            });
        }
    ).catch(
        internalErrorHandler(req, res)
    );
}