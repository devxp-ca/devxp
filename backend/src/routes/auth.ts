// Imports
import {Router} from "express";
import {redirectToGithub} from "../controllers/github";
const authRouter = Router();

authRouter.get("/", redirectToGithub);
authRouter.get("/github", redirectToGithub);

export default authRouter;
