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
							align="left"
							sx={{paddingBottom: 4}}>
							Managing cloud resources has never been easier
						</Typography>
						<Typography
							variant="h5"
							color="white"
							align="left"
							sx={{paddingLeft: 2, marginBottom: 4}}>
							We know that learning and incorporating new tools
							into your project is necessary, but it can often be
							time consuming, overwhelming, and down right
							painful.
						</Typography>
						<Typography
							variant="h4"
							color="primary.main"
							align="left">
							DevXP provides a user friendly interface to:
						</Typography>
						<Typography
							variant="h5"
							color="white"
							align="left"
							sx={{paddingLeft: 2}}>
							<p>
								{">"} Write terraform configuration files for
								multiple cloud providers without touching code
							</p>
							<p>{">"} Follow best practices by default</p>
							<p>
								{">"} Learn the details of cloud infrastructure
								as you configure
							</p>
						</Typography>
					</Grid>
				</Grid>
			</Grid>

			{/* SECOND PAGE */}
			<Grid
				container
				direction="column"
				alignItems="center"
				sx={{
					width: "100%",
					paddingBottom: 8
				}}>
				<Grid
					item
					direction="column"
					sx={{
						padding: 8
					}}>
					<Typography
						variant="h3"
						color="primary.main"
						align="center">
						Simple configuration of resource instances
					</Typography>
				</Grid>
				<Grid item>
					<GenericModal
						dummyModal={true}
						isOpen={true}
						title="Edit EC2 Resource"
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
												Object.keys("ec2").length > 1
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
	);
}
