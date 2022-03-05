import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {ThemeProvider} from "@mui/material/styles";
import {lightTheme} from "../style/themes";

import {CONFIG} from "../config";

import Backsplash from "../assets/memories.gif";
import titleImage from "../assets/devxp-title.png";

export default function MainLandingVisual() {
	return (
		<ThemeProvider theme={lightTheme}>
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
							Empowering developers by making DevOps simple.
						</Typography>
						<Button
							onClick={() =>
								(window.location.href = `${CONFIG.BACKEND_URL}${CONFIG.AUTH_PATH}`)
							}
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
