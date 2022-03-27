import * as React from "react";
import {Button, Box} from "@mui/material";
import GenericModal from "./GenericModal";

interface modalProps {
	isOpen: boolean;
	handleClose: () => void;
	onOk?: () => void;
	title: string;
	bodyText?: string;
}

export default function OkModal({
	isOpen,
	handleClose,
	onOk,
	title,
	bodyText
}: modalProps) {
	return (
		<GenericModal
			isOpen={isOpen}
			handleClose={handleClose}
			title={title}
			bodyText={bodyText}
			children={
				<Box style={{display: "flex", justifyContent: "center"}}>
					<Button
						onClick={onOk ?? handleClose}
						sx={{
							padding: 2,
							fontSize: 18,
							pointerEvents: "initial"
						}}>
						OK
					</Button>
				</Box>
			}
		/>
	);
}
