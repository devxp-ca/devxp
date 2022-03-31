import React from "react";
import {BackendError} from "../terraformManager";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export interface ModalParams {
	isSubmitModal: boolean;
	title: string;
	body: string;
	loading?: boolean;
}

export type modalSetter = (params: React.SetStateAction<ModalParams>) => void;
export type modalBoolSetter = (param: React.SetStateAction<boolean>) => void;

export const handleOpenSuccessModal =
	(setModalInfo: modalSetter, setOpenModal: modalBoolSetter) => () => {
		setModalInfo({
			isSubmitModal: false,
			title: "Success",
			body: "Your changes have been successfully pushed to your repository"
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
			title: "Are you sure you want to submit?",
			body: `Once confirmed, DevXP will submit changes to a temporary branch of ${repoName} for review.
			To invoke your infrastructure you will need to run the following commands in your terminal.`
		});
		setOpenModal(true);
	};

export const handleOpenSubmitModalNoRepo =
	(setModalInfo: modalSetter, setOpenModal: modalBoolSetter) => () => {
		setModalInfo({
			isSubmitModal: false,
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
