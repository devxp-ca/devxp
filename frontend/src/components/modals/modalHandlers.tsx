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
	(setModalInfo: modalSetter, setOpenModal: modalBoolSetter, url: string) =>
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
					<ol start={3}>
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
		setModalInfo({
			isSubmitModal: false,
			isSuccessModal: false,
			title: "Submission Failed",
			body:
				errors[0]?.message ??
				"Something went wrong, please make sure all the fields are filled out and try again"
		});
		setOpenModal(true);
	};

export const handleCloseModal = (setOpenModal: modalBoolSetter) => () => {
	setOpenModal(false);
};
