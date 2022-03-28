import * as React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {lightTheme, darkTheme} from "../style/themes";
import axios from "axios";
import {CONFIG} from "../config";
import ToolManagerCard from "../components/toolManagerCard";
import TerraformManager from "../components/terraformManager";
import {terraformDataSettings} from "../components/terraformOptions";
import {
	ThemeProvider,
	Autocomplete,
	TextField,
	Button,
	Tooltip,
	Grid,
	Paper
} from "@mui/material";
import OkModal from "../components/modals/OkModal";
import OkCancelModal from "../components/modals/OkCancelModal";
import {handleCloseModal} from "../components/modals/modalHandlers";
import LoadingModal from "../components/modals/loadingModal";
import CopyRepoSettingsModal from "../components/modals/CopyRepoSettingsModal";
import ThemeButton from "../style/ThemeButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import terraformPNGDark from "../assets/Terraform_Vertical_Dark.png";
import terraformPNGLight from "../assets/Terraform_Vertical_Light.png";

export default function ToolManager() {
	//media query to determine if the preferred theme is light
	const prefersLightMode = useMediaQuery("(prefers-color-scheme: light)");
	//set local storage to the preferred theme
	localStorage.setItem("preferredTheme", prefersLightMode ? "light" : "dark");
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
		} else {
			setTheme(lightTheme);
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
						width: "100%",
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
								sx={{paddingTop: 2}}>
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
