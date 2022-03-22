import * as React from "react";
import {Button} from "@mui/material";
import GenericModal from "./GenericModal";

interface modalProps {
	isOpen: boolean;
	handleClose: () => void;
	onYes: () => void;
	onNo: () => void;
	newRepo: string; // The repo that is in the process of being selected
}

export function LoadRepoDataModal({
	isOpen,
	handleClose,
	onYes,
	onNo,
	newRepo
}: modalProps) {
	return (
		<GenericModal
			isOpen={isOpen}
			handleClose={handleClose}
			title={`${
				newRepo ?? "This repo"
			} has settings already saved. Would you like to load them?`}
			bodyText={"Selecting YES will undo any currently unsaved changes."}>
			<Button
				onClick={onNo}
				sx={{
					padding: 2,
					fontSize: 18,
					pointerEvents: "initial"
				}}>
				NO
			</Button>
			<Button
				onClick={onYes}
				sx={{
					padding: 2,
					fontSize: 18,
					pointerEvents: "initial"
				}}>
				YES
			</Button>
		</GenericModal>
	);
}
