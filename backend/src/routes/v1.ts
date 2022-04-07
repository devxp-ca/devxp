// Imports
import {Router} from "express";
import {getRepoFiles} from "../controllers/getRepoFiles";
import {getRepoList} from "../controllers/getRepoList";
// import {getNumRepoPages} from "../controllers/getRepoPages";
import {postSettings, getSettings} from "../controllers/settings";
import {submitPr} from "../middleware/analytics";
import getRepoFilesValidator from "../validators/getRepoFilesValidator";
import getSettingsValidator from "../validators/getSettingsValidator";
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

//Repository files information
apiV1Router.get("/repo/file", getRepoFilesValidator, getRepoFiles);

//Number of pages of repos
// apiV1Router.get("/repoPages", getNumRepoPages);

apiV1Router.post(
	"/settings",
	[...settingsValidator, ...submitPr],
	postSettings
);
apiV1Router.get("/settings", getSettingsValidator, getSettings);

//Edit terraform settings
//apiV1Router.patch("/terraform", TODO);

//Get current terraform settings
//apiV1Router.get("/terraform", TODO);

export default apiV1Router;
