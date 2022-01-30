import {Router} from "express";
import apiV1Router from "./v1";
import authRouter from "./auth";
import cookieToHeader from "../validators/cookieToHeader";

//Initialize main router object
const mainRouter = Router();

//Here we can include static routes or API routes from other files
mainRouter.use("/api", cookieToHeader, apiV1Router);
mainRouter.use("/api/v1", cookieToHeader, apiV1Router);
mainRouter.use("/auth", cookieToHeader, authRouter);

//Include a basic route for testing
mainRouter.get("/", (_req, res) => res.send("Welcome to DevExp"));

export default mainRouter;
