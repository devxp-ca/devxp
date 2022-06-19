import React, {Dispatch} from "react";
import {handleCloseModal} from "./modalHandlers";
import OkCancelModal from "./OkCancelModal";
import OkModal from "./OkModal";

export default ({
	setSettingsHaveBeenEdited,
	overwriteWarningModalIsOpen,
	setOverwriteWarningModalIsOpen,
	exitWarningModalIsOpen,
	setExitWarningModalIsOpen,
	backButton
}: {
	setSettingsHaveBeenEdited: Dispatch<boolean>;
	overwriteWarningModalIsOpen: boolean;
	setOverwriteWarningModalIsOpen: Dispatch<boolean>;
	exitWarningModalIsOpen: boolean;
	setExitWarningModalIsOpen: Dispatch<boolean>;
	backButton: () => void;
}) => {
	return (
		<>
			<OkModal
				isOpen={overwriteWarningModalIsOpen}
				handleClose={handleCloseModal(setOverwriteWarningModalIsOpen)}
				title={"Heads up!"}
				bodyText={
					"It looks like you have uncommitted changes.\
							If you select a new repo, your uncommitted changes will be lost.\
							Consider creating a pull request before changing repos."
				}
			/>
			<OkCancelModal
				isOpen={exitWarningModalIsOpen}
				onOk={() => {
					backButton();
					setExitWarningModalIsOpen(false);
					setSettingsHaveBeenEdited(false);
				}}
				onCancel={() => {
					setExitWarningModalIsOpen(false);
				}}
				title={"Hold Up!"}
				bodyText={
					"If you leave, you will lose your currently unsaved settings."
				}
			/>
		</>
	);
};
