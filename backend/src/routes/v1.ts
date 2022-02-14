// Imports
import {Router} from "express";
import {getRepoList} from "../controllers/getRepoList";
import postSettings from "../controllers/postSettings";

const apiV1Router = Router();

//Here we can setup our actual API routes

apiV1Router.get("/", (_req, res) =>
	res.json({
		healthy: true
	})
);

apiV1Router.get("/getRepos", getRepoList);

apiV1Router.post("/settings", postSettings);

export default apiV1Router;
