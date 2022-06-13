import {Request, Response} from "express";
import {createJob, indentLines} from "../pipeline/pipeline";
import {Job} from "../types/pipeline";

export const pipelineController = (req: Request, res: Response) => {
	const jobs = req.body.settings.jobs as Job[];

	let pipeline = `
name: 🖥️ DevXP Deployment Pipeline 🚀

on:
  push:
    branches:
      - main
      - "**/**.tf"
      - .github/workflows/devxp.yml

jobs:
`;

	jobs.forEach(job => {
		pipeline = `${pipeline}${indentLines(createJob(job), 2)}`;
	});

	console.log(pipeline);

	res.status(200).json({});
};
