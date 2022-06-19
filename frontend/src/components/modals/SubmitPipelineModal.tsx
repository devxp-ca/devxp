import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import React, {Dispatch} from "react";
import GenericModal from "./GenericModal";
import LinearProgress from "@mui/material/LinearProgress";
import {
	handleCloseModal,
	handleAwaitSuccessModal,
	handleOpenSuccessModal,
	handleOpenFailModal
} from "./modalHandlers";
import {SubmitModalInfoInterface} from "../managedToolWrapper";
import {CONFIG} from "../../config";
import {removeEmptyKeys} from "../../util";
import axios, {AxiosError} from "axios";
import {Job} from "../pipelineManager";

export default ({
	submitModalIsOpen,
	setSubmitModalIsOpen,
	submitModalInfo,
	setSubmitModalInfo,
	selectedRepo,
	selectedProvider,
	setSettingsHaveBeenEdited,
	jobs
}: {
	submitModalIsOpen: boolean;
	setSubmitModalIsOpen: Dispatch<boolean>;
	submitModalInfo: SubmitModalInfoInterface;
	setSubmitModalInfo: Dispatch<SubmitModalInfoInterface>;
	selectedRepo: string;
	selectedProvider: string;
	setSettingsHaveBeenEdited: Dispatch<boolean>;
	jobs: Job[];
}) => {
	const handleSubmit = () => {
		setSubmitModalIsOpen(true);
		handleAwaitSuccessModal(
			setSubmitModalInfo,
			setSubmitModalIsOpen,
			selectedRepo
		)();
		axios
			.post(
				`${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`,
				removeEmptyKeys({
					tool: "pipeline",
					repo: selectedRepo,
					settings: {
						jobs
					}
				})
			)
			.then(response => {
				if (!response.data.response) {
					handleOpenFailModal(
						setSubmitModalInfo,
						setSubmitModalIsOpen
					)([
						{
							timestamp: new Date(),
							status: 500,
							error: "Invalid response",
							path: CONFIG.SETTINGS_PATH,
							message: "No valid next steps were returned"
						}
					]);
				} else {
					setSettingsHaveBeenEdited(false);
					handleOpenSuccessModal(
						setSubmitModalInfo,
						setSubmitModalIsOpen,
						`${CONFIG.BACKEND_URL}${CONFIG.NEXT_STEPS_PATH}${response.data.response}`
					)();
				}
			})
			.catch((error: AxiosError) => {
				console.dir(error.response.data);
				handleOpenFailModal(
					setSubmitModalInfo,
					setSubmitModalIsOpen
				)(error.response?.data?.errors ?? []);
			});
	};

	return (
		<GenericModal
			isOpen={submitModalIsOpen}
			handleClose={handleCloseModal(setSubmitModalIsOpen)}
			title={submitModalInfo.title}
			bodyText={submitModalInfo.body}
			width={submitModalInfo.width}
			isSuccess={submitModalInfo.isSuccessModal}
			children={
				<>
					{!submitModalInfo.loading && (
						<Stack
							style={{
								display: "flex",
								justifyContent: "center"
							}}>
							<Button
								color="secondary"
								variant="contained"
								size="large"
								sx={{
									marginTop: 2,
									":hover": {
										bgcolor: "secondary.main",
										opacity: 0.9
									}
								}}
								onClick={
									submitModalInfo.isSubmitModal
										? handleSubmit
										: handleCloseModal(setSubmitModalIsOpen)
								}>
								{submitModalInfo.isSubmitModal
									? "Confirm"
									: "Ok"}
							</Button>
						</Stack>
					)}
					{!!submitModalInfo.loading && (
						<div>
							<LinearProgress></LinearProgress>
						</div>
					)}
					{}
				</>
			}
		/>
	);
};
