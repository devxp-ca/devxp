import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {lightTheme} from "../style/themes";

import logoBlack from "../assets/logo-black.png";
import terraformPNG from "../assets/Terraform_Horizontal.png";
import cloudProvidersPNG from "../assets/cloud_providers.png";
import arrowInfo from "../assets/arrow-info.png";
import arrowSecondary from "../assets/arrow-secondary.png";

import easyConfigPNG from "../assets/easy_config.png";
import githubIcon from "../assets/github_icon.png";
import writeConfigPNG from "../assets/write_config.png";
import bestPracticesPNG from "../assets/best_practices.png";

export default function ProductPage() {
	/* Might eventually want to style the scrollbar */
	return (
		<Grid
			item
			container
			direction="column"
			sx={{
				maxWidth: "100vw",
				height: "100%",
				backgroundColor: "primary.dark"
			}}>
			{/* FIRST PAGE */}
			<Grid
				item
				sx={{
					paddingTop: 4,
					paddingBottom: 4,
					height: "100vh",
					marginBottom: 2
				}}>
				<Grid
					container
					direction="row"
					sx={{
						backgroundColor: "#FFFFFF10",
						minHeight: "100%",
						maxHeight: "100%",
						width: "100%"
					}}>
					<Grid
						item
						container
						direction="column"
						sx={{
							padding: "6vh 18vh 6vh 18vh",
							width: "50%",
							minWidth: 500,
							flexGrow: 1,
							minHeight: "70%"
						}}>
						<Grid
							item
							sx={{
								padding: "2vh",
								flexGrow: 2,
								backgroundColor: "primary.main",
								borderRadius: 2
							}}>
							<Box
								sx={{
									height: "100%",
									width: "100%",
									backgroundImage: `url(${logoBlack})`,
									backgroundSize: "contain",
									backgroundPosition: "center center",
									backgroundRepeat: "no-repeat"
								}}></Box>
						</Grid>
						<Grid item sx={{padding: 4, flexGrow: 1}}>
							<Box
								sx={{
									height: "100%",
									width: "100%",
									backgroundImage: `url(${arrowSecondary})`,
									backgroundSize: "contain",
									backgroundPosition: "center center",
									backgroundRepeat: "no-repeat"
								}}></Box>
						</Grid>
						<Grid
							item
							sx={{
								padding: "3vh",
								flexGrow: 2,
								backgroundColor:
									lightTheme.palette.secondary.main,
								borderRadius: 2
							}}>
							<Box
								sx={{
									height: "100%",
									width: "100%",
									backgroundImage: `url(${terraformPNG})`,
									backgroundSize: "contain",
									backgroundPosition: "center center",
									backgroundRepeat: "no-repeat"
								}}></Box>
						</Grid>
						<Grid item sx={{padding: 4, flexGrow: 1}}>
							<Box
								sx={{
									height: "100%",
									width: "100%",
									backgroundImage: `url(${arrowInfo})`,
									backgroundSize: "contain",
									backgroundPosition: "center center",
									backgroundRepeat: "no-repeat"
								}}></Box>
						</Grid>
						<Grid
							item
							sx={{
								padding: "2vh",
								flexGrow: 2,
								backgroundColor: lightTheme.palette.info.main,
								borderRadius: 2
							}}>
							<Box
								sx={{
									height: "100%",
									width: "100%",
									backgroundImage: `url(${cloudProvidersPNG})`,
									backgroundSize: "contain",
									backgroundPosition: "center center",
									backgroundRepeat: "no-repeat"
								}}></Box>
						</Grid>
					</Grid>
					<Grid
						item
						container
						direction="column"
						sx={{
							padding: 8,
							width: "50%",
							flexGrow: 1,
							flexShrink: 3,
							justifyContent: "center"
						}}>
						<Typography
							variant="h3"
							color="primary.main"
							align="center"
							sx={{padding: "4vh"}}>
							Managing cloud resources has never been easier
						</Typography>
						<Typography variant="h5" color="white" align="center">
							DevXP is a web application designed to make your
							life easier. We know that learning and incorporating
							new tools into your project is necessary, but it can
							often be time consuming, overwhelming, and down
							right painful. DevXP helps by introducing you to new
							tools in an easy-to-adapt manner by reducing the
							number of configuration options, providing
							explanations in simple language, and even writing
							configuration files for you.
						</Typography>
					</Grid>
				</Grid>
			</Grid>

			{/* REMOVE */}
			<Grid item sx={{paddingTop: 4, paddingBottom: 4}}>
				<Typography variant="h5" color="white" align="center">
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
					<Typography variant="h5" color="white">
						... integrates directly with GitHub
					</Typography>
				</Grid>
				<Grid
					item
					container
					sx={{alignItems: "center", justifyContent: "center"}}>
					<Typography variant="h5" color="white">
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
					<Typography variant="h5" color="white">
						... writes complex configuration files for you
					</Typography>
				</Grid>
				<Grid
					item
					container
					sx={{alignItems: "center", justifyContent: "center"}}>
					<Typography variant="h5" color="white">
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
	);
}
