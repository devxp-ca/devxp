import React, {Dispatch} from "react";
import {SubmitModalInfoInterface} from "../managedToolWrapper";
import {Job} from "../pipelineManager";
import SubmitPipelineModal from "./SubmitPipelineModal";

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
	return (
		<>
			<SubmitPipelineModal
				{...{
					submitModalIsOpen,
					setSubmitModalIsOpen,
					submitModalInfo,
					setSubmitModalInfo,
					selectedRepo,
					selectedProvider,
					setSettingsHaveBeenEdited,
					jobs
				}}
			/>
		</>
	);
};
