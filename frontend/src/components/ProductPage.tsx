import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {lightTheme} from "../style/themes";
import GenericModal from "./modals/GenericModal";
import typeToResource from "./resources/typeToResource";
import Resource from "./resources/Resource";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import {Cookies} from "react-cookie";

import logoBlack from "../assets/logo-black.png";
import terraformPNG from "../assets/Terraform_Horizontal.png";
import cloudProvidersPNG from "../assets/cloud_providers.png";
import arrowInfo from "../assets/arrow-info.png";
import arrowSecondary from "../assets/arrow-secondary.png";
import axios from "axios";
import {CONFIG} from "../config";
import PreviewRender from "../components/livePreview/previewRender";
import {resourceSettings} from "./terraformOptions";

const dummyResources: (resourceSettings & any)[] = [
	{
		type: "ec2",
		id: "YourServer",
		autoIam: true,
		ami: "AUTO_UBUNTU",
		instance_type: "t2.micro"
	},
	{
		type: "s3",
		id: "YourBucket",
		autoIam: true
	},
	{
		type: "dynamoDb",
		id: "YourDatabase",
		autoIam: true,
		attributes: [
			{
				name: "id",
				type: "S",
				isHash: true
			}
		]
	},
	{
		type: "lambdaFunc",
		id: "YourFunction",
		autoIam: true,
		ami: "",
		instance_type: "",
		attributes: [],
		functionName: "serverless",
		runtime: "nodejs14.x",
		handler: "main",
		filename: "index.js",
		keepWarm: true
	}
];

export default function ProductPage() {
	/* Might eventually want to style the scrollbar */

	const [previewData, setPreviewData] = React.useState("");

	const [dynamicDummy, setDynamicDummy] = React.useState(dummyResources);

	React.useEffect(() => {
		axios
			.post(`${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`, {
				preview: true,
				tool: "terraform",
				settings: {
					provider: "aws",
					secure: false,
					resources: dynamicDummy
				}
			})
			.then(response => {
				setPreviewData(response.data.preview);
			})
			.catch(console.error);
	}, dynamicDummy);

	//for the get started button
	const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
		const cookies = new Cookies();
		const token = cookies.get("token");
		if (token) {
			return true;
		} else {
			return false;
		}
	});

	const handleLogin = () => {
		if (isLoggedIn) {
			// redirect to toolmanager
			window.location.href = "/toolManager";
		} else {
			// set the state to logged in
			setIsLoggedIn(true);
			// call the API to login with github
			window.location.href = `${CONFIG.BACKEND_URL}${CONFIG.AUTH_PATH}`;
		}
	};

	return (
		<Grid
			item
			container
			direction="column"
			sx={{
				backgroundColor: "primary.dark",
				overflowX: "hidden",
				paddingBottom: 8
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
				<Grid item sx={{width: "100%"}}>
					<GenericModal
						dummyModal={true}
						isOpen={true}
						title="Edit EC2 Resource"
						width="100%"
						children={
							<Grid
								container
								direction="column"
								sx={{
									"& > div": {width: "90%"}
								}}
								alignItems="center">
								{
									typeToResource(
										{
											type: "ec2",
											repo: "testRepo",
											isModifying: false,
											ami: "AUTO_UBUNTU",
											instance_type: "t2.micro",
											onChange: (
												data: resourceSettings
											) => {
												setDynamicDummy([
													data,
													...dynamicDummy.slice(1)
												]);
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
							{dynamicDummy.map((resource, index) => (
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
								paddingBottom: 4,
								alignContent: "center",
								justifyContent: "center"
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
			<Grid
				item
				container
				alignItems="center"
				justifyContent="center"
				sx={{width: "100%", p: 4, backgroundColor: "#FFFFFF10"}}>
				<Grid item>
					<Button
						onClick={handleLogin}
						color="primary"
						variant="contained"
						size="large"
						sx={{
							":hover": {
								bgcolor: "info.main",
								color: "white",
								opacity: 0.9
							},
							fontSize: 24
						}}>
						Get Started
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
}
