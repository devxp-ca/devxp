import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {ThemeProvider} from "@mui/material/styles";
import {lightTheme} from "../lightTheme";

import GenericModal from "./GenericModal";

import Backsplash from "../assets/memories.gif";
import titleImage from "../assets/devxp-title.png";

export default function MainLandingVisual() {
	//For the modal that pops up from the 'Get Started' button
	const [openStartModal, setOpenStartModal] = React.useState(false);
	const handleOpenStartModal = () => {
		setOpenStartModal(true);
	};
	const handleCloseStartModal = () => {
		setOpenStartModal(false);
	};
	const startModalChildren = () => {
		return (
			<div style={{display: "flex", justifyContent: "center"}}>
				<Button
					color="secondary"
					variant="contained"
					size="large"
					sx={{marginTop: 2}}>
					Sign Up
				</Button>
			</div>
		);
	};

	return (
		<ThemeProvider theme={lightTheme}>
			<GenericModal
				isOpen={openStartModal}
				handleClose={handleCloseStartModal}
				title={"Example Title"}
				bodyText={"Example text"}
				children={startModalChildren()}
			/>
			<Box
				sx={{
					width: "100%",
					backgroundImage: `url(${Backsplash})`,
					marginTop: 3,
					paddingTop: 45,
					paddingBottom: 15,
					backgroundSize: "contain",
					backgroundRepeat: "no-repeat"
				}}>
				<Box sx={{width: "100%", textAlign: "center"}}>
					<Box
						sx={{
							width: "100%",
							height: 70,
							backgroundImage: `url(${titleImage})`,
							backgroundPosition: "center",
							backgroundSize: "contain",
							backgroundRepeat: "no-repeat",
							marginBottom: 2
						}}></Box>
					<Box
						sx={{
							width: "100%",
							backgroundColor: "rgba(0, 0, 0, 0.75)",
							paddingTop: 3,
							paddingBottom: 3,
							textAlign: "center"
						}}>
						<Typography variant="h5" color="white">
							DevOps is hard -- We don't believe it has to be
						</Typography>
						<Button
							onClick={handleOpenStartModal}
							color="secondary"
							variant="contained"
							size="large"
							sx={{marginTop: 2}}>
							Get Started
						</Button>
					</Box>
				</Box>
			</Box>
		</ThemeProvider>
	);
}
