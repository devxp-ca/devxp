// Imports
import {Router} from "express";
import {getRepoList} from "../controllers/getRepoList";
import {postSettings, getSettings} from "../controllers/settings";
import {settingsValidator} from "../validators/terraformValidator";

const apiV1Router = Router();

//Here we can setup our actual API routes

apiV1Router.get("/", (_req, res) =>
	res.json({
		healthy: true
	})
);

//Repository information
apiV1Router.get("/repo", getRepoList);

apiV1Router.post("/settings", settingsValidator, postSettings);
apiV1Router.get("/settings", getSettings);

//Edit terraform settings
//apiV1Router.patch("/terraform", TODO);

//Get current terraform settings
//apiV1Router.get("/terraform", TODO);

export default apiV1Router;
