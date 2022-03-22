import * as React from "react";
import {LinearProgress} from "@mui/material";
import GenericModal from "./GenericModal";

interface modalProps {
	isOpen: boolean;
	loadingTitle: string;
}

export default function LoadingModal({isOpen, loadingTitle}: modalProps) {
	return (
		<GenericModal
			isOpen={isOpen}
			handleClose={() => {}}
			title={loadingTitle}
			children={<LinearProgress />}
		/>
	);
}
