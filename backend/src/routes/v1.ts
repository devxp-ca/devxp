// Imports
import {Router} from "express";
import {getRepoList} from "../controllers/getRepoList";

const apiV1Router = Router();

//Here we can setup our actual API routes

apiV1Router.get("/", (_req, res) =>
	res.json({
		healthy: true
	})
);

apiV1Router.get("/getRepos", getRepoList)

export default apiV1Router;
