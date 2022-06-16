import * as React from "react";
import Navbar from "../components/Navbar";
import {lightTheme, darkTheme} from "../style/themes";
import ToolManagerCard from "../components/toolManagerCard";
import TerraformManager from "../components/terraformManager";
import ManagedToolWrapper, {
	ManagedToolProps
} from "../components/managedToolWrapper";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import GlobalStyles from "@mui/material/GlobalStyles";

import ThemeButton from "../style/ThemeButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import terraformPNGDark from "../assets/Terraform_Vertical_Dark.png";
import terraformPNGLight from "../assets/Terraform_Vertical_Light.png";
import logoPNG from "../assets/logo.png";
import githubPNG from "../assets/github.png";
import PipelineManager from "../components/pipelineManager";

export default function ToolManager() {
	//True if screen width > 600px, else false
	const isMobile = useMediaQuery("(max-width:600px)");

	const prefersLightMode = useMediaQuery("(prefers-color-scheme: light)");

	if (!localStorage.getItem("preferredTheme")) {
		//media query to determine if the preferred theme is light
		//set local storage to the preferred theme
		localStorage.setItem(
			"preferredTheme",
			prefersLightMode ? "light" : "dark"
		);
	}

	//theme state & toggle function
	const [theme, setTheme] = React.useState(
		//check local storage for preferred theme
		localStorage.getItem("preferredTheme") === "light"
			? lightTheme
			: darkTheme
	);
	//function to handle theme toggle
	const toggleTheme = () => {
		if (theme === lightTheme) {
			setTheme(darkTheme);
			localStorage.setItem("preferredTheme", "dark");
		} else {
			setTheme(lightTheme);
			localStorage.setItem("preferredTheme", "light");
		}
	};

	const [selectedTool, setSelectedTool] = React.useState<string>("none");

	const [managedTool, setManagedTool] =
		React.useState<(props: ManagedToolProps) => React.ReactNode>(null);
	React.useEffect(() => {
		if (selectedTool === "terraform") {
			setManagedTool(() => (props: ManagedToolProps) => (
				<TerraformManager {...props} />
			));
		} else if (selectedTool === "pipeline") {
			setManagedTool(() => (props: ManagedToolProps) => (
				<PipelineManager {...props} />
			));
		} else {
			setManagedTool(null);
		}
	}, [selectedTool]);

	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles
				styles={theme => ({
					html: {backgroundColor: theme.palette.secondary.light}
				})}
			/>
			<Paper>
				<Grid
					container
					direction="column"
					sx={{
						backgroundColor: "secondary.light",
						paddingLeft: isMobile === true ? 0 : 6,
						paddingRight: isMobile === true ? 0 : 6,
						minHeight: "100vh"
					}}>
					<Grid
						item
						sx={{
							width: "100%"
						}}>
						<Navbar
							children={ThemeButton({
								handleClick: toggleTheme,
								theme: theme
							})}
						/>
					</Grid>
					<Grid
						item
						container
						direction="column"
						sx={{paddingBottom: 10, minHeight: "100%"}}>
						<Grid
							container
							direction="row"
							justifyContent="space-between"
							columns={2}
							sx={{mt: 3}}></Grid>
						{selectedTool == "none" && (
							<Grid
								container
								direction="row"
								justifyContent={
									isMobile === true ? "center" : "auto"
								}
								spacing={2}
								sx={{paddingTop: 2}}>
								<Grid item>
									<ToolManagerCard
										onClick={() =>
											setSelectedTool("terraform")
										}
										title="Terraform"
										desc="An infrastructure as code tool that can manage all your cloud resource needs"
										image={
											theme === darkTheme
												? terraformPNGDark
												: terraformPNGLight
										}
										color="#844FBA"
									/>
								</Grid>
								<Grid item>
									<ToolManagerCard
										title="Pipelines"
										onClick={() => {
											setSelectedTool("pipeline");
										}}
										desc="Build, provision, and deployment pipelines using Github Actions"
										image={githubPNG}
										color="#262b32"
										imagesx={{
											height: "364.781px",
											objectFit: "contain"
										}}
									/>
								</Grid>
								<Grid item>
									<ToolManagerCard
										title="Under Development"
										desc="The remaining tools we plan to support are currently under construction"
										image={logoPNG}
										color="#4DACFF"
										imagesx={{
											height: "364.781px",
											objectFit: "contain",
											imageRendering: "pixelated"
										}}
									/>
								</Grid>
							</Grid>
						)}
						{selectedTool !== "none" && (
							<ManagedToolWrapper
								backButton={() => setSelectedTool("none")}
								children={managedTool}
							/>
						)}
					</Grid>
				</Grid>
			</Paper>
		</ThemeProvider>
	);
}
