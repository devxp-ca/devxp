import React from "react";
import Paper from "@mui/material/Paper";

import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import {BackendError} from "../managedToolWrapper";

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
		response: string
	) =>
	() => {
		setModalInfo({
			isSubmitModal: false,
			isSuccessModal: true,
			title: "Success",
			body: (
				<div>
					<div
						style={{
							marginBottom: "10px"
						}}>
						Your changes have been successfully pushed to your
						repository, but you're not done!
					</div>
					<Divider />
					<div
						style={{
							marginTop: "10px",
							textAlign: "center"
						}}>
						Please view your customized next steps:{" "}
						<Link href={response} target="_blank">
							here
						</Link>
					</div>
				</div>
			)
		});
		setOpenModal(true);
		window.open(response, "_blank").focus();
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
