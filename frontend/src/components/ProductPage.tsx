import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {lightTheme} from "../style/themes";
import GenericModal from "./modals/GenericModal";
import typeToResource from "./resources/typeToResource";

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
				backgroundColor: "primary.dark"
			}}>
			{/* FIRST PAGE */}
			<Grid
				item
				sx={{
					paddingTop: 4,
					paddingBottom: 4
				}}>
				<Grid
					container
					direction="row"
					sx={{
						backgroundColor: "#FFFFFF10"
					}}>
					<Grid
						item
						container
						direction="column"
						sx={{
							padding: "6vh 18vh 6vh 18vh",
							height: "93vh",
							width: "50%",
							flexGrow: 1,
							minWidth: 450
						}}>
						<Grid
							item
							sx={{
								padding: 2,
								flexGrow: 2,
								backgroundColor: "primary.main",
								borderRadius: 2
							}}>
							<Box
								sx={{
									height: "100%",
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
									backgroundImage: `url(${arrowSecondary})`,
									backgroundSize: "contain",
									backgroundPosition: "center center",
									backgroundRepeat: "no-repeat"
								}}></Box>
						</Grid>
						<Grid
							item
							sx={{
								padding: 3,
								flexGrow: 2,
								backgroundColor:
									lightTheme.palette.secondary.main,
								borderRadius: 2
							}}>
							<Box
								sx={{
									height: "100%",
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
									backgroundImage: `url(${arrowInfo})`,
									backgroundSize: "contain",
									backgroundPosition: "center center",
									backgroundRepeat: "no-repeat"
								}}></Box>
						</Grid>
						<Grid
							item
							sx={{
								padding: 2,
								flexGrow: 2,
								backgroundColor: lightTheme.palette.info.main,
								borderRadius: 2
							}}>
							<Box
								sx={{
									height: "100%",
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
							justifyContent: "center",
							width: "50%",
							flexGrow: 1
						}}>
						<Typography
							variant="h3"
							color="primary.main"
							align="center"
							sx={{padding: 4}}>
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

			{/* SECOND PAGE */}
			<Grid
				item
				sx={{
					paddingTop: 4,
					paddingBottom: 4,
					marginBottom: 2
				}}>
				<Grid
					container
					direction="row"
					sx={{
						minHeight: "100%",
						maxHeight: "100%",
						width: "100%"
					}}>
					<Grid
						item
						container
						direction="column"
						sx={{
							justifyContent: "center"
						}}>
						<Typography
							variant="h3"
							color="primary.main"
							align="center">
							Simple configuration of resource instances
						</Typography>
					</Grid>
					<Grid
						sx={{
							paddingTop: 8,
							paddingBottom: 8,
							paddingLeft: 16,
							paddingRight: 16,
							display: "border-box"
						}}>
						<GenericModal
							dummyModal={true}
							isOpen={true}
							title="Edit Resource"
							children={
								<Grid
									container
									direction="column"
									alignItems="center">
									{
										typeToResource(
											{
												type: "ec2",
												repo: "testRepo",
												isModifying:
													Object.keys("ec2").length >
													1
											},
											false
										) as React.ReactElement
									}
								</Grid>
							}
						/>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
