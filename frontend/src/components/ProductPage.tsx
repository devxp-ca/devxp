import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {lightTheme} from "../style/themes";
import GenericModal from "./modals/GenericModal";
import typeToResource from "./resources/typeToResource";
import Resource from "./resources/Resource";
import Paper from "@mui/material/Paper";

import logoBlack from "../assets/logo-black.png";
import terraformPNG from "../assets/Terraform_Horizontal.png";
import cloudProvidersPNG from "../assets/cloud_providers.png";
import arrowInfo from "../assets/arrow-info.png";
import arrowSecondary from "../assets/arrow-secondary.png";
import axios from "axios";
import {CONFIG} from "../config";
import PreviewRender from "../components/livePreview/previewRender";

const dummyResources: resourceSettings[] = [
	{
		type: "ec2",
		id: "YourServer",
		autoIam: true,
		ami: "",
		instance_type: "",
		attributes: [],
		functionName: "",
		runtime: ""
	},
	{
		type: "ec2",
		id: "YourBucket",
		autoIam: true,
		ami: "",
		instance_type: "",
		attributes: [],
		functionName: "",
		runtime: ""
	},
	{
		type: "ec2",
		id: "YourDatabase",
		autoIam: true,
		ami: "",
		instance_type: "",
		attributes: [],
		functionName: "",
		runtime: ""
	},
	{
		type: "ec2",
		id: "YourStorage",
		autoIam: true,
		ami: "",
		instance_type: "",
		attributes: [],
		functionName: "",
		runtime: ""
	}
];

export default function ProductPage() {
	/* Might eventually want to style the scrollbar */

	const [previewData, setPreviewData] = React.useState("");

	return (
		<Grid
			item
			container
			direction="column"
			sx={{
				backgroundColor: "primary.dark",
				overflowX: "hidden"
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
					alignItems="center"
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
									backgroundRepeat: "no-repeat",
									imageRendering: "pixelated"
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
									backgroundRepeat: "no-repeat",
									imageRendering: "pixelated"
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
							paddingTop: 8,
							paddingBottom: 8,
							paddingRight: 4,
							paddingLeft: 4,
							justifyContent: "center",
							width: "50%",
							flexGrow: 1
						}}>
						<Typography
							variant="h3"
							color="primary.main"
							align="center"
							sx={{paddingBottom: 4}}>
							Managing cloud resources has never been easier
						</Typography>
						<Typography
							variant="h5"
							color="white"
							align="center"
							sx={{paddingLeft: 2, marginBottom: 4}}>
							We know that learning and incorporating new tools
							into your project is necessary, but it can often be
							time consuming, overwhelming, and down right
							painful.
						</Typography>
						<Typography
							variant="h4"
							color="primary.main"
							align="center">
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
					paddingBottom: 10,
					marginBottom: 6
				}}>
				<Grid
					item
					direction="column"
					sx={{
						paddingTop: 8,
						paddingBottom: 8,
						paddingLeft: 2,
						paddingRight: 2
					}}>
					<Typography
						variant="h3"
						color="primary.main"
						align="center">
						Simple configuration of resource instances...
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
											isModifying: false,
											onChange: (data: any) => {
												axios
													.post(
														`${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`,
														{
															preview: true,
															tool: "terraform",
															settings: {
																provider: "aws",
																secure: false,
																resources: [
																	data
																]
															}
														}
													)
													.then(response => {
														setPreviewData(
															response.data
																.preview
														);
													})
													.catch(console.error);
											}
										},
										false
									) as React.ReactElement
								}
							</Grid>
						}
					/>
				</Grid>
			</Grid>

			{/* THIRD PAGE*/}
			<Grid
				container
				direction="column"
				sx={{
					marginBottom: 6
				}}>
				<Grid item>
					<Typography
						variant="h3"
						color="primary.main"
						align="center"
						sx={{
							paddingLeft: 2,
							paddingRight: 2,
							paddingBottom: 6
						}}>
						...and DevXP handles the tedious terraform files
					</Typography>
				</Grid>
				<Grid container direction="row">
					<Grid
						item
						container
						direction="column"
						sx={{
							minHeight: "93vh",
							width: "40%",
							flexGrow: 1,
							minWidth: 450,
							paddingLeft: 2,
							paddingRight: 2
						}}>
						<Grid
							item
							container
							direction="row"
							alignItems="center"
							justifyContent="center"
							sx={{
								paddingTop: 8,
								paddingBottom: 8,
								flexGrow: 2,
								borderRadius: 2
							}}>
							{dummyResources.map((resource, index) => (
								<Grid
									item
									sx={{padding: 2}}
									key={`prevInstanceCardGrid${index}`}>
									{(
										typeToResource(
											resource,
											true
										) as Resource<any, any>
									).toCard(() => {}, 250)}
								</Grid>
							))}
						</Grid>
					</Grid>
					<Grid
						item
						container
						direction="row"
						sx={{
							justifyContent: "center",
							width: "60%",
							flexGrow: 1,
							minHeight: "93vh"
						}}>
						<Grid
							item
							sx={{
								flexGrow: 1,
								maxWidth: "10vh",
								borderRadius: 2,
								paddingLeft: 2
							}}>
							<Box
								sx={{
									height: "100%",
									backgroundImage: `url(${arrowInfo})`,
									backgroundSize: "contain",
									backgroundPosition: "center center",
									backgroundRepeat: "no-repeat",
									transform: "rotate(90deg)",
									imageRendering: "pixelated"
								}}></Box>
						</Grid>

						<Grid
							item
							sx={{
								flexGrow: 1,
								borderRadius: 2,
								paddingLeft: 4,
								paddingTop: 4,
								paddingRight: 4,
								paddingBottom: 4
							}}>
							<Paper
								sx={{
									backgroundColor: "secondary.light",
									borderRadius: 2,
									overflowX: "hidden",
									overflowY: "hidden",
									maxHeight: "90vh",
									maxWidth: "90vh",
									filter: "drop-shadow(0px 0px 16px #00000070)"
								}}>
								<PreviewRender data={previewData} raw={true} />
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
