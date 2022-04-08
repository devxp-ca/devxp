import * as React from "react";
import Navbar from "../components/Navbar";
import {lightTheme, darkTheme} from "../style/themes";
import ToolManagerCard from "../components/toolManagerCard";
import TerraformManager from "../components/terraformManager";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import ThemeButton from "../style/ThemeButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import terraformPNGDark from "../assets/Terraform_Vertical_Dark.png";
import terraformPNGLight from "../assets/Terraform_Vertical_Light.png";
import logoPNG from "../assets/logo.png";

export default function ToolManager() {
	if (!localStorage.getItem("preferredTheme")) {
		//media query to determine if the preferred theme is light
		const prefersLightMode = useMediaQuery("(prefers-color-scheme: light)");
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

	const setSelectedToolCardCallback = (tool_name: string) => {
		const callback = () => {
			setSelectedTool(tool_name);
		};
		return callback;
	};

	return (
		<ThemeProvider theme={theme}>
			<Paper>
				<Grid
					container
					direction="column"
					sx={{
						minHeight: "100vh",
						backgroundColor: "secondary.light",
						paddingLeft: 6,
						paddingRight: 6
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
								spacing={2}
								sx={{paddingTop: 2}}>
								<Grid item>
									<ToolManagerCard
										onClick={setSelectedToolCardCallback(
											"terraform"
										)}
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
										title="Under Construction"
										desc="The remaining tools we plan to support are currently under construction"
										image={logoPNG}
										color="#4DACFF"
									/>
								</Grid>
							</Grid>
						)}
						{selectedTool == "terraform" && (
							<TerraformManager
								backButton={setSelectedToolCardCallback("none")}
							/>
						)}
					</Grid>
				</Grid>
			</Paper>
		</ThemeProvider>
	);
}
