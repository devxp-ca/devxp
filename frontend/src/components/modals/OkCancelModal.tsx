import * as React from "react";
import {Button, Grid} from "@mui/material";
import GenericModal from "./GenericModal";

interface modalProps {
	isOpen: boolean;
	onOk: () => void;
	onCancel: () => void;
	title: string;
	bodyText?: string;
}

export default function OkCancelModal({
	isOpen,
	onOk,
	onCancel,
	title,
	bodyText
}: modalProps) {
	return (
		<GenericModal
			isOpen={isOpen}
			handleClose={onCancel}
			title={title}
			bodyText={bodyText}
			children={
				<Grid style={{display: "flex", justifyContent: "center"}}>
					<Button
						onClick={onOk}
						sx={{
							padding: 2,
							fontSize: 18,
							pointerEvents: "initial"
						}}>
						OK
					</Button>
					<Button
						onClick={onCancel}
						sx={{
							padding: 2,
							fontSize: 18,
							pointerEvents: "initial"
						}}>
						Cancel
					</Button>
				</Grid>
			}
		/>
	);
}
