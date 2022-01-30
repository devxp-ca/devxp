// Imports
import {Router} from "express";
import {redirectToGithub, callbackFromGithub} from "../controllers/github";
import {githubCodeValidator} from "../validators/githubValidator";
const authRouter = Router();

authRouter.get("/github", githubCodeValidator, callbackFromGithub);
authRouter.get("/", redirectToGithub);

export default authRouter;
