import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {ThemeProvider} from "@mui/material/styles";
import {lightTheme} from "../style/themes";
import Grid from "@mui/material/Grid";

import {CONFIG} from "../config";

import Backsplash from "../assets/memories-transparent.gif";
import titleImage from "../assets/devxp-title.png";

export default function MainLandingVisual() {
	return (
		<ThemeProvider theme={lightTheme}>
			<Grid
				container
				sx={{
					height: "100%",
					marginLeft: -1,
					marginTop: -1,
					backgroundColor: "#0f101a",
					position: "absolute"
				}}>
				<Grid
					item
					sx={{
						width: "100%",
						height: "8vh"
					}}></Grid>
				<Grid
					item
					sx={{
						width: "100%",
						height: "92vh",
						backgroundImage: `url(${Backsplash})`,
						backgroundSize: "contain",
						backgroundPosition: "center top",
						backgroundRepeat: "no-repeat",
						backgroundColor: "#0f101a"
					}}>
					<Box
						sx={{
							width: "100%",
							textAlign: "center",
							marginTop: "50vh"
						}}>
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
				</Grid>
				{/* Use this grid as the parent for the product page (put everything inside) */}
				{/* Temporary height and backgroundColor */}
				{/* Might eventually want to style the scrollbar */}
				<Grid
					item
					sx={{
						width: "100%",
						height: "8vh",
						backgroundColor: lightTheme.palette.primary.main
					}}></Grid>
			</Grid>
		</ThemeProvider>
	);
}
