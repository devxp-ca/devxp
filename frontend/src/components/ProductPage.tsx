import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {ThemeProvider} from "@mui/material/styles";
import {lightTheme} from "../style/themes";
import Grid from "@mui/material/Grid";

import titleImage from "../assets/devxp-title.png";
import terraformPNG from "../assets/Terraform_Vertical.png";
import cloudProvidersPNG from "../assets/cloud_providers.png";
import easyConfigPNG from "../assets/easy_config.png";
import githubIcon from "../assets/github_icon.png";
import writeConfigPNG from "../assets/write_config.png";
import bestPracticesPNG from "../assets/best_practices.png";

export default function ProductPage() {
	return (
		<ThemeProvider theme={lightTheme}>
			<Grid container>
				{/* Use this grid as the parent for the product page (put everything inside) */}
				{/* Temporary height and backgroundColor */}
				{/* Might eventually want to style the scrollbar */}
				<Grid
					item
					container
					direction="column"
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
					<Typography variant="h5" color="black" align="center">
						DevXP...
					</Typography>
					<Grid
						item
						container
						sx={{alignItems: "center", justifyContent: "center"}}>
						<img
							src={githubIcon}
							alt="DevXP integrates directly with GitHub"
							style={{
								backgroundColor: "white",
								height: "200px",
								margin: 20
							}}
						/>
						<Typography variant="h5" color="black">
							... integrates directly with GitHub
						</Typography>
					</Grid>
					<Grid
						item
						container
						sx={{alignItems: "center", justifyContent: "center"}}>
						<Typography variant="h5" color="black">
							... has simple configuration options
						</Typography>
						<img
							src={easyConfigPNG}
							alt="DevXP has simple configuration options"
							style={{
								backgroundColor: "white",
								height: "500px",
								margin: 20
							}}
						/>
					</Grid>
					<Grid
						item
						container
						sx={{alignItems: "center", justifyContent: "center"}}>
						<img
							src={writeConfigPNG}
							alt="DevXP writes complex configuration files for you"
							style={{
								height: "300px",
								margin: 20
							}}
						/>
						<Typography variant="h5" color="black">
							... writes complex configuration files for you
						</Typography>
					</Grid>
					<Grid
						item
						container
						sx={{alignItems: "center", justifyContent: "center"}}>
						<Typography variant="h5" color="black">
							... empowers you to follow best practices with ease
						</Typography>
						<img
							src={bestPracticesPNG}
							alt="DevXP empowers you to follow best practices with ease"
							style={{
								height: "300px",
								margin: 20
							}}
						/>
					</Grid>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
}
