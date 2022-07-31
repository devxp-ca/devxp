import {Link} from "@mui/material";
import Divider from "@mui/material/Divider";
import React from "react";
import AwsAccessKey from "./awsAccessKey";
import NextStepCodeblock from "./nextStepCodeblock";
export default ({
	url,
	initUrl,
	provider
}: {
	url: string;
	initUrl?: string;
	provider: string;
}) => {
	const aws = provider === "aws";

	return (
		<div>
			<div style={{marginBottom: "18px"}}>
				Your changes have been successfully pushed to your repository.
				Here are your next steps:
			</div>
			<Divider />
			<ol>
				<li>
					Install{" "}
					<Link
						href="https://learn.hashicorp.com/tutorials/terraform/install-cli"
						target="_blank">
						Terraform
					</Link>{" "}
					to your machine or CI server
				</li>
			</ol>
			<Divider />
			<ol start={2}>
				<li>
					Authenticate with your provider. We{" "}
					<Link
						href="https://github.com/devxp-ca/devxp/wiki/Tool-Manager-Configuration#prerequisites"
						target="_blank">
						recommend
					</Link>{" "}
					installing the{" "}
					{aws ? (
						<Link
							href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
							target="_blank">
							aws
						</Link>
					) : (
						<Link
							href="https://cloud.google.com/sdk/docs/install"
							target="_blank">
							gcloud
						</Link>
					)}{" "}
					cli tool and running:
				</li>
			</ol>
			{aws ? <AwsAccessKey isPipeline={false} start={3} /> : <></>}
			<NextStepCodeblock>
				{aws ? "aws configure" : "gcloud auth login"}
			</NextStepCodeblock>
			<Divider />
			{!initUrl ? (
				<ol start={3 + (aws ? 4 : 0)}>
					<li>
						Merge or locally checkout your{" "}
						<Link href={url} target="_blank">
							Pull Request
						</Link>
					</li>
				</ol>
			) : (
				<>
					{" "}
					<div
						style={{
							margin: "1rem",
							marginBottom: "inherit"
						}}>
						We've noticed this is the{" "}
						<span style={{fontWeight: "bolder"}}>first time</span>{" "}
						you've worked with DevXP!
					</div>
					<div
						style={{
							margin: "1rem",
							marginBottom: "inherit"
						}}>
						Because of this, you will need to merge{" "}
						<span style={{fontWeight: "bolder"}}>two</span> pull
						requests.
					</div>
					<ol start={3 + (aws ? 4 : 0)}>
						<li>
							First merge the{" "}
							<Link href={initUrl} target="_blank">
								Initialization
							</Link>{" "}
							Pull Request.
						</li>
						<li>
							Then initialize your infrastructure, by running the
							following{" "}
							<Link
								href="https://learn.hashicorp.com/tutorials/terraform/install-cli"
								target="_blank">
								terraform
							</Link>{" "}
							commands:
						</li>
					</ol>
					<NextStepCodeblock>terraform init</NextStepCodeblock>
					<NextStepCodeblock>terraform apply</NextStepCodeblock>
					<Divider />
					<ol start={5 + (aws ? 4 : 0)}>
						<li>
							Next merge the{" "}
							<Link href={url} target="_blank">
								Configuration
							</Link>{" "}
							Pull Request.
						</li>
						<li>
							Then invoke your infrastructure, by running the
							following{" "}
							<Link
								href="https://learn.hashicorp.com/tutorials/terraform/install-cli"
								target="_blank">
								terraform
							</Link>{" "}
							commands:
						</li>
					</ol>
					<NextStepCodeblock>terraform init</NextStepCodeblock>
					<NextStepCodeblock>terraform apply</NextStepCodeblock>
				</>
			)}
			<Divider />
			{!initUrl && (
				<>
					<ol start={4 + (aws ? 4 : 0)}>
						<li>
							Invoke your infrastructure, by running the following{" "}
							<Link
								href="https://learn.hashicorp.com/tutorials/terraform/install-cli"
								target="_blank">
								terraform
							</Link>{" "}
							commands:
						</li>
					</ol>
					<NextStepCodeblock>terraform init</NextStepCodeblock>
					<NextStepCodeblock>terraform apply</NextStepCodeblock>
					<Divider />
				</>
			)}
			<ol start={initUrl ? 7 + (aws ? 4 : 0) : 5 + (aws ? 4 : 0)}>
				<li>Focus on writing awesome software!</li>
			</ol>
		</div>
	);
};
