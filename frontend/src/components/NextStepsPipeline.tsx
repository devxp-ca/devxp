import {Link} from "@mui/material";
import Divider from "@mui/material/Divider";
import React from "react";
import AwsAccessKey from "./awsAccessKey";
import NextStepCodeblock from "./nextStepCodeblock";
export default ({
	url,
	provider
}: {
	url: string;
	provider?: "aws" | "google";
}) => {
	const repo = url.replace(/\/pull\/[0-9]+\/?$/, "");
	const actions = `${repo}/settings/secrets/actions/new`;
	return (
		<div>
			<div style={{marginBottom: "18px"}}>
				Your changes have been successfully pushed to your repository.
				Here are your next steps:
			</div>
			<Divider />
			{provider === "aws" && (
				<>
					<AwsAccessKey isPipeline={true} start={1} />
					<Divider />
					<ol start={5}>
						<li>
							Create the following two{" "}
							<Link href={actions} target="_blank">
								Action Secrets
							</Link>
							, and fill in the appropriate values:
						</li>
					</ol>
					<NextStepCodeblock>
						Name: AWS_ACCESS_KEY_ID
						<br />
						Value: [YOUR AWS KEY ID]
					</NextStepCodeblock>
					<NextStepCodeblock>
						Name: AWS_SECRET_ACCESS_KEY
						<br />
						Value: [YOUR AWS KEY SECRET]
					</NextStepCodeblock>
					<Divider />
				</>
			)}
			<ol start={provider === "aws" ? 6 : 1}>
				<li>
					<div>
						Merge your{" "}
						<Link href={url} target="_blank">
							Pull Request
						</Link>
					</div>
					<div
						style={{
							fontStyle: "italic",
							marginTop: "0.5rem",
							marginBottom: "-0.5rem"
						}}>
						Please note that you should merge this pull request{" "}
						<span style={{fontWeight: "bolder"}}>before</span> any
						other outstanding DevXP pull requests.
					</div>
				</li>
			</ol>
		</div>
	);
};
