// Imports
import {Router} from "express";
import {redirectToGithub, callbackFromGithub} from "../controllers/github";
import {githubCodeValidator} from "../validators/githubValidator";
const authRouter = Router();

//callback from a successful auth
authRouter.get("/github", githubCodeValidator, callbackFromGithub);

//Sends the client to github oauth2
authRouter.get("/", redirectToGithub);

export default authRouter;
