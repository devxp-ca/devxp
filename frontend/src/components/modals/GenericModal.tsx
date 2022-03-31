import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

interface modalProps {
	isOpen: boolean;
	handleClose?: () => void;
	title?: string;
	bodyText?: string;
	children?: JSX.Element | JSX.Element[]; // Can be used for buttons or any other custom element we want on a modal,
	width?: number | string;
	dummyModal?: boolean;
}

export default function GenericModal({
	isOpen,
	handleClose,
	title,
	bodyText,
	children,
	width,
	dummyModal = false
}: modalProps) {
	const modalStyle = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: width ?? 400,
		bgcolor: "secondary.light",
		boxShadow: 24,
		zIndex: 100
	};

	const dummyModalStyle = {
		bgcolor: "secondary.light",
		boxShadow: 24,
		zIndex: 100,
		marginLeft: "10%",
		marginRight: "10%"
	};

	const titleBoxStyle = {
		textAlign: "center",
		bgcolor: "info.main",
		width: "100%",
		borderRadius: "4px 4px 0px 0px"
	};

	const bodyStyle = {
		width: "100%",
		padding: 2,
		boxSizing: "border-box"
	};

	return !dummyModal ? (
		<Modal open={isOpen} onClose={handleClose}>
			<Paper sx={modalStyle}>
				<Box sx={titleBoxStyle}>
					<Typography
						variant="h5"
						component="h2"
						sx={{padding: 2}}
						color="black">
						{title}
					</Typography>
				</Box>
				<Box sx={bodyStyle}>
					<Typography sx={{mt: 2}}>{bodyText}</Typography>
					{children}
				</Box>
			</Paper>
		</Modal>
	) : (
		<Paper sx={dummyModalStyle}>
			<Box sx={titleBoxStyle}>
				<Typography
					variant="h6"
					component="h2"
					sx={{padding: 2}}
					color="black">
					{title}
				</Typography>
			</Box>
			<Box sx={bodyStyle}>
				<Typography sx={{mt: 2}}>{bodyText}</Typography>
				{children}
			</Box>
		</Paper>
	);
}
