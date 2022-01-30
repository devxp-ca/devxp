// Imports
import {Router} from "express";
import {redirectToGithub, callbackFromGithub} from "../controllers/github";
const authRouter = Router();

authRouter.get("/github", callbackFromGithub);
authRouter.get("/", redirectToGithub);

export default authRouter;
