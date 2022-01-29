import { Router } from "express";

//Initialize main router object
const mainRouter = Router();

//Here we can include static routes or API routes from other files

//Include a basic health check route
mainRouter.get("/", (_req, res) => res.send({
	healthy: true
}));

export default mainRouter;
