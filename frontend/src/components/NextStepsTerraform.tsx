import {Link} from "@mui/material";
import Divider from "@mui/material/Divider";
import React from "react";
export default ({
	url,
	initUrl,
	provider
}: {
	url: string;
	initUrl?: string;
	provider: string;
}) => {
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
					{provider === "aws" ? (
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
			<Paper sx={{boxShadow: 6}}>
				<pre style={{padding: "10px"}}>
					<code>
						{provider === "aws"
							? "aws configure"
							: "gcloud auth login"}
					</code>
				</pre>
			</Paper>
			<Divider />
			{!initUrl ? (
				<ol start={3}>
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
					<ol start={3}>
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
					<Paper sx={{boxShadow: 6}}>
						<pre style={{padding: "10px"}}>
							<code>terraform init</code>
						</pre>
					</Paper>
					<Paper sx={{boxShadow: 6}}>
						<pre style={{padding: "10px"}}>
							<code>terraform apply</code>
						</pre>
					</Paper>
					<Divider />
					<ol start={5}>
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
					<Paper sx={{boxShadow: 6}}>
						<pre style={{padding: "10px"}}>
							<code>terraform init</code>
						</pre>
					</Paper>
					<Paper sx={{boxShadow: 6}}>
						<pre style={{padding: "10px"}}>
							<code>terraform apply</code>
						</pre>
					</Paper>
				</>
			)}
			<Divider />
			{!initUrl && (
				<>
					<ol start={4}>
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
					<Paper sx={{boxShadow: 6}}>
						<pre style={{padding: "10px"}}>
							<code>terraform init</code>
						</pre>
					</Paper>
					<Paper sx={{boxShadow: 6}}>
						<pre style={{padding: "10px"}}>
							<code>terraform apply</code>
						</pre>
					</Paper>
					<Divider />
				</>
			)}
			<ol start={initUrl ? 7 : 5}>
				<li>Focus on writing awesome software!</li>
			</ol>
		</div>
	);
};
