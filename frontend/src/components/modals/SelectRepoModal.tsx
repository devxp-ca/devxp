import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

interface modalProps {
	isOpen: boolean;
	handleClose: (event: any, reason: any) => void;
	title?: string;
	bodyText?: string;
	children?: JSX.Element[]; // Can be used for buttons or any other custom element we want on a modal
}

export default function SelectRepoModal({
	isOpen,
	handleClose,
	title,
	bodyText,
	children
}: modalProps) {
	const modalStyle = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: "white",
		boxShadow: 24,
		zIndex: 100
	};

	const titleBoxStyle = {
		textAlign: "center",
		bgcolor: "primary.main",
		width: "100%"
	};

	const bodyStyle = {
		width: "100%",
		padding: 2,
		boxSizing: "border-box"
	};

	return (
		<div>
			<Modal open={isOpen} onClose={handleClose}>
				<Box sx={modalStyle}>
					<Box sx={titleBoxStyle}>
						<Typography
							variant="h6"
							component="h2"
							sx={{padding: 2}}>
							{title}
						</Typography>
					</Box>
					<Grid container direction="column" sx={bodyStyle}>
						<Typography sx={{m: 2, justifyContent: "center"}}>
							{bodyText}
						</Typography>
						{children}
					</Grid>
				</Box>
			</Modal>
		</div>
	);
}
