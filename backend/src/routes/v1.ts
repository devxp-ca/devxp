// Imports
import {Router} from "express";

const apiV1Router = Router();

//Here we can setup our actual API routes

apiV1Router.get("/", (_req, res) =>
	res.send({
		healthy: true
	})
);

export default apiV1Router;
