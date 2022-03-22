import * as React from "react";
import {Button, Grid} from "@mui/material";
import GenericModal from "./GenericModal";

interface modalProps {
	isOpen: boolean;
	handleClose: () => void;
	onYes: () => void;
	onNo: () => void;
	title: string;
	bodyText: string;
}

export default function YesNoModal({
	isOpen,
	handleClose,
	onYes,
	onNo,
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
				<Grid style={{display: "flex", justifyContent: "center"}}>
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
				</Grid>
			}
		/>
	);
}
