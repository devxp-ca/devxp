import React from "react";
import Divider from "@mui/material/Divider";
import {Link} from "@mui/material";

export default (props: {isPipeline: boolean; start: number}) => {
	return (
		<>
			<ol start={props.start + 0}>
				<li>
					{props.isPipeline
						? "This pipeline needs access to your AWS account in order to provision your infrastructure. To do this, "
						: "To authenticate your CLI with AWS, you will need an access key. To aquire this, "}
					navigate to the AWS{" "}
					<Link
						href="https://console.aws.amazon.com/iam/home#/security_credentials"
						target="_blank">
						security credentials page
					</Link>
				</li>
			</ol>
			<Divider />
			<ol start={props.start + 1}>
				<li>
					Click on "
					<span style={{fontWeight: "bolder"}}>
						Access keys (access key ID and secret access key)
					</span>
					"
				</li>
			</ol>
			<Divider />
			<ol start={props.start + 2}>
				<li>
					Click on "
					<span style={{fontWeight: "bolder"}}>
						Create New Access Key
					</span>
					"
				</li>
			</ol>
			<Divider />
			<ol start={props.start + 3}>
				<li>
					Click on "
					<span style={{fontWeight: "bolder"}}>Show Access Key</span>"
				</li>
			</ol>
		</>
	);
};
