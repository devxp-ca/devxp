import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {ThemeProvider} from "@mui/material/styles";
import {lightTheme} from "../lightTheme";

import GenericModal from "./GenericModal";

export default function MainLandingVisual() {
	//For the modal that pops up from the 'Get Started' button
	const [openStartModal, setOpenStartModal] = React.useState(false);
	const handleOpenStartModal = () => {
		setOpenStartModal(true);
	};
	const handleCloseStartModal = () => {
		setOpenStartModal(false);
	};

	return (
		<ThemeProvider theme={lightTheme}>
			<GenericModal
				isOpen={openStartModal}
				handleClose={handleCloseStartModal}
				title={"Example"}
				bodyText={"text"}
			/>
			<Box
				sx={{
					width: "100%",
					backgroundColor: "gray",
					marginTop: 3,
					paddingTop: 40,
					paddingBottom: 15
				}}>
				<Box sx={{width: "100%", textAlign: "center"}}>
					<Typography variant="h1">DEV XP</Typography>
					<Box
						sx={{
							width: "100%",
							backgroundColor: "rgba(255, 255, 255, 0.5)",
							paddingTop: 4,
							paddingBottom: 4,
							textAlign: "center"
						}}>
						<Typography variant="h5">
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
