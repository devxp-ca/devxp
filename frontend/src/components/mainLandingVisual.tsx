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
import terraformPNG from "../assets/Terraform_Vertical.png";
import cloudProvidersPNG from "../assets/cloud_providers.png";

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
						<Box>
							<Typography variant="h5" color="white">
								<span
									style={{
										backgroundColor: "rgba(0, 0, 0, 0.75)"
									}}>
									Empowering developers by making DevOps
									simple.
								</span>
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
						height: "100%",
						backgroundColor: lightTheme.palette.primary.main
					}}>
					<Box sx={{textAlign: "center"}}>
						<img
							src={cloudProvidersPNG}
							alt="Cloud Service Providers"
							style={{
								height: "200px",
								borderRadius: 50,
								margin: 20
							}}
						/>
					</Box>
					<Typography variant="h5" color="black" align="center">
						is made easy by
					</Typography>
					<Box sx={{textAlign: "center"}}>
						<img
							src={terraformPNG}
							alt="Terraform by HashiCorp"
							style={{
								backgroundColor: "white",
								height: "200px",
								borderRadius: 50,
								margin: 20
							}}
						/>
					</Box>
					<Typography variant="h5" color="black" align="center">
						is made easy by
					</Typography>
					<Box sx={{textAlign: "center"}}>
						<img
							src={titleImage}
							alt="DevXP"
							style={{
								height: "100px",
								margin: 50
							}}
						/>
					</Box>
					<Typography variant="h5" color="black" align="center">
						DevXP is a web application designed to make your life
						easier. We know that learning and incorporating new
						tools into your project is necessary, but it can often
						be time consuming, overwhelming, and down right painful.
						DevXP helps by introducing you to new tools in an
						easy-to-adapt manner by reducing the number of
						configuration options, providing explanations in simple
						language, and even writing configuration files for you.
					</Typography>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
}
