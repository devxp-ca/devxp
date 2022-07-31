import React from "react";
import Navbar from "../components/Navbar";

import Footer from "../components/Footer";
import Grid from "@mui/material/Grid";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {darkTheme} from "../style/themes";
import GlobalStyles from "@mui/material/GlobalStyles";
import axios from "axios";
import {CONFIG} from "../config";
import NextStepsTerraform from "../components/NextStepsTerraform";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NextStepsPipeline from "../components/NextStepsPipeline";

export default () => {
	const [nextSteps, setNextSteps] = React.useState<any>(undefined);

	React.useEffect(() => {
		if (
			window.location.search &&
			window.location.search.split("=") &&
			window.location.search.split("=").length > 1
		) {
			axios
				.get(
					`${CONFIG.BACKEND_URL}${CONFIG.NEXT_STEPS_API}${
						window.location.search.split("=")[1]
					}`
				)
				.then(resp => {
					setNextSteps(resp.data.response);
				})
				.catch(err => {
					console.error(err);
					if (err.response!.status === 401) {
						window.location.href = `${CONFIG.BACKEND_URL}${CONFIG.AUTH_PATH}`;
					}
				});
		}
	}, []);

	return (
		<ThemeProvider theme={darkTheme}>
			<GlobalStyles
				styles={theme => ({
					html: {backgroundColor: theme.palette.secondary.light}
				})}
			/>
			<Grid
				container
				direction="column"
				sx={{
					minHeight: "100vh",
					backgroundColor: "primary.dark",
					width: "auto"
				}}>
				<Grid
					container
					direction="column"
					sx={{
						backgroundColor: "primary.dark",
						width: "auto"
					}}>
					<Grid
						item
						sx={{
							width: "100%",
							paddingLeft: 6,
							paddingRight: 6
						}}>
						<Navbar />
						<Grid
							item
							sx={{
								width: "100%",
								paddingTop: 8,
								paddingBottom: 2,
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}}>
							{nextSteps && (
								<>
									<Paper
										sx={{
											bgcolor: "secondary.light",
											overflowY: "auto",
											overflowX: "visible",
											maxWidth: "900px"
										}}>
										<Box
											sx={{
												width: "100%",
												padding: 2,
												boxSizing: "border-box"
											}}>
											<Typography sx={{mt: 2}}>
												{nextSteps.tool ===
												"terraform" ? (
													<NextStepsTerraform
														url={
															nextSteps.pullRequest
														}
														initUrl={
															nextSteps.initialPullRequest
														}
														provider={
															nextSteps.provider
														}
													/>
												) : (
													<NextStepsPipeline
														url={
															nextSteps.pullRequest
														}
														provider={
															nextSteps.provider
														}
													/>
												)}
											</Typography>
										</Box>
									</Paper>
								</>
							)}
						</Grid>
					</Grid>
				</Grid>
				<Footer />
			</Grid>
		</ThemeProvider>
	);
};
