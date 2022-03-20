import React from "react";
import {BackendError} from "../terraformManager";

export interface ModalParams {
	isSubmitModal: boolean;
	title: string;
	body: string;
	loading?: boolean;
}

export type modalSetter = (params: React.SetStateAction<ModalParams>) => void;
export type modalBoolSetter = (param: React.SetStateAction<boolean>) => void;

export const handleOpenSuccessModal =
	(setModalText: modalSetter, setOpenModal: modalBoolSetter) => () => {
		setModalText({
			isSubmitModal: false,
			title: "Success",
			body: "Your changes have been successfully pushed to your repository"
		});
		setOpenModal(true);
	};

export const handleAwaitSuccessModal =
	(
		setModalText: modalSetter,
		setOpenModal: modalBoolSetter,
		repoName: string
	) =>
	() => {
		setModalText({
			isSubmitModal: false,
			title: `Pushing to ${repoName}`,
			body: "",
			loading: true
		});
		setOpenModal(true);
	};

export const handleOpenSubmitModalConfirmation =
	(
		setModalText: modalSetter,
		setOpenModal: modalBoolSetter,
		repoName: string
	) =>
	() => {
		setModalText({
			isSubmitModal: true,
			title: "Are you sure you want to submit?",
			body: `Once confirmed, we will push a pull request to a temporary branch on ${repoName} for review`
		});
		setOpenModal(true);
	};

export const handleOpenSubmitModalNoRepo =
	(setModalText: modalSetter, setOpenModal: modalBoolSetter) => () => {
		setModalText({
			isSubmitModal: false,
			title: "Please select a repository",
			body: "You must select a repository before submitting"
		});
		setOpenModal(true);
	};

export const handleOpenFailModal =
	(setModalText: modalSetter, setOpenModal: modalBoolSetter) =>
	(errors: BackendError[]) => {
		setModalText({
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
