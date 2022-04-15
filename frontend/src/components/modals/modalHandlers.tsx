import React from "react";
import Paper from "@mui/material/Paper";

import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import {BackendError} from "../terraformManager";

export interface ModalParams {
	isSubmitModal: boolean;
	isSuccessModal: boolean;
	title: string;
	body: string | JSX.Element | JSX.Element[];
	loading?: boolean;
	width?: string;
}

export type modalSetter = (params: React.SetStateAction<ModalParams>) => void;
export type modalBoolSetter = (param: React.SetStateAction<boolean>) => void;

export const handleOpenSuccessModal =
	(
		setModalInfo: modalSetter,
		setOpenModal: modalBoolSetter,
		url: string,
		provider: string
	) =>
	() => {
		setModalInfo({
			isSubmitModal: false,
			isSuccessModal: true,
			title: "Success",
			width: "40vw",
			body: (
				<div>
					<div style={{marginBottom: "18px"}}>
						Your changes have been successfully pushed to your
						repository. Here are your next steps:
					</div>
					<Divider />
					<ol>
						<li>
							Merge or locally checkout your{" "}
							<Link href={url} target="_blank">
								Pull Request
							</Link>
						</li>
					</ol>
					<Divider />
					<ol start={2}>
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
					<ol start={3}>
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
					<ol start={5}>
						<li>Focus on writing awesome software!</li>
					</ol>
				</div>
			)
		});
		setOpenModal(true);
	};

export const handleAwaitSuccessModal =
	(
		setModalInfo: modalSetter,
		setOpenModal: modalBoolSetter,
		repoName: string
	) =>
	() => {
		setModalInfo({
			isSubmitModal: false,
			isSuccessModal: false,
			title: `Pushing to ${repoName}`,
			body: "",
			loading: true
		});
		setOpenModal(true);
	};

export const handleOpenSubmitModalConfirmation =
	(
		setModalInfo: modalSetter,
		setOpenModal: modalBoolSetter,
		repoName: string
	) =>
	() => {
		setModalInfo({
			isSubmitModal: true,
			isSuccessModal: false,
			title: "Are you sure you want to submit?",
			body: (
				<>
					Once confirmed, DevXP will submit changes to a temporary
					branch of{" "}
					<span
						style={{
							fontWeight: 800
						}}>
						{repoName}
					</span>{" "}
					for review.
				</>
			)
		});
		setOpenModal(true);
	};

export const handleOpenSubmitModalNoRepo =
	(setModalInfo: modalSetter, setOpenModal: modalBoolSetter) => () => {
		setModalInfo({
			isSubmitModal: false,
			isSuccessModal: false,
			title: "Please select a repository",
			body: "You must select a repository before submitting"
		});
		setOpenModal(true);
	};

export const handleOpenFailModal =
	(setModalInfo: modalSetter, setOpenModal: modalBoolSetter) =>
	(errors: BackendError[]) => {
		const message: string =
			errors[0]?.message ??
			"Something went wrong, please make sure all the fields are filled out and try again";
		const messageSplit = message.split("\n").map(str =>
			str.match(/^"([^/"]+\/[^/"]+)"$/g) ? (
				<Paper
					sx={{
						boxShadow: 6,
						marginTop: "4px",
						marginBottom: "4px"
					}}>
					<pre style={{margin: "0"}}>
						<code>{str.replace(/"/g, "")}</code>
					</pre>
				</Paper>
			) : (
				<>
					{str}
					<br />
				</>
			)
		);

		setModalInfo({
			isSubmitModal: false,
			isSuccessModal: false,
			title: "Submission Failed",
			body: (
				<div
					style={{
						marginTop: "-16px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						textAlign: "justify"
					}}>
					{messageSplit}
				</div>
			)
		});
		setOpenModal(true);
	};

export const handleCloseModal = (setOpenModal: modalBoolSetter) => () => {
	setOpenModal(false);
};
