import * as React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Box from "@mui/material/Box";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {lightTheme} from "../style/themes";
import axios from "axios";
import {CONFIG} from "../config";
import ToolManagerCard from "../components/toolManagerCard";
import TerraformManager from "../components/terraformManager";
import TerraformOptions, {
	terraformDataSettings
} from "../components/terraformOptions";
import Grid from "@mui/material/Grid";
import {Autocomplete, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";

import terraformPNG from "../assets/Terraform_Vertical.png";

export default function ToolManager() {
	const [repoList, setRepoList] = React.useState([]);
	const [selectedRepo, setSelectedRepo] = React.useState<string>("");
	const [isRepoSelected, setIsRepoSelected] = React.useState(false);
	const [selectedRepoData, setSelectedRepoData] =
		React.useState<terraformDataSettings>(null);

	const [selectedTool, setSelectedTool] = React.useState<string>("none");

	const setSelectedRepoFromAutocomplete = (repo_full_name: string) => {
		setSelectedRepo(repo_full_name);
		console.dir(repo_full_name);
		setIsRepoSelected(true);
		axios
			.get(`${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`, {
				headers: {
					repo: repo_full_name
				}
			})
			.then((response: any) => {
				setSelectedRepoData(response.data);
				console.dir(response.data);
			})
			.catch((error: any) => {
				console.error(error);
			});
	};

	const setSelectedToolCardCallback = (tool_name: string) => {
		const callback = () => {
			setSelectedTool(tool_name);
		};
		return callback;
	};

	//on mount, get the list of repos
	React.useEffect(() => {
		//api call to get repos
		axios
			.get(`${CONFIG.BACKEND_URL}${CONFIG.REPO_PATH}`)
			.then((response: any) => {
				setRepoList(response.data.repos);
			})
			.catch((error: any) => {
				//TODO: Render an error component
				console.error(error);
			});
	}, []);

	return (
		<ThemeProvider theme={lightTheme}>
			{/* It's 99 here because of the Navbar -1 margin */}
			<Box style={{display: "flex", minHeight: "99vh"}}>
				<Box
					style={{
						width: "100%",
						paddingLeft: 30,
						paddingRight: 30
					}}>
					<Grid container direction="column" sx={{paddingBottom: 10}}>
						<Navbar />
						<Grid
							container
							direction="row"
							justifyContent="space-between"
							columns={2}
							sx={{mt: 2, mb: -6}}>
							<Grid item>
								<Typography variant="h5">
									Current Repo:{" "}
									{isRepoSelected ? selectedRepo : "None"}
								</Typography>
							</Grid>
							<Grid item>
								<Autocomplete
									sx={{padding: "3px", width: "300px"}}
									id="repo-select"
									options={repoList}
									getOptionLabel={(option: any) =>
										option.full_name
									}
									renderInput={(params: any) => (
										<TextField
											{...params}
											label="Select A Repo"
											variant="outlined"
										/>
									)}
									onChange={(event: any, value: any) => {
										setSelectedRepoFromAutocomplete(
											value.full_name
										);
									}}
									isOptionEqualToValue={(
										option: any,
										value: any
									) => {
										return (
											option.full_name === value.full_name
										);
									}}
								/>
							</Grid>
						</Grid>
						{selectedTool == "none" && (
							<Grid
								container
								direction="row"
								sx={{paddingTop: 5}}>
								<ToolManagerCard
									onClick={setSelectedToolCardCallback(
										"terraform"
									)}
									title="Terraform"
									desc="An infrastructure as code tool that can manage all your cloud resource needs"
									image={terraformPNG}
									color="#844FBA"
								/>
							</Grid>
						)}
						{selectedTool == "terraform" && (
							<TerraformManager
								selectedRepo={selectedRepo}
								isRepoSelected={isRepoSelected}
								backButton={setSelectedToolCardCallback("none")}
								repoData={selectedRepoData}
							/>
						)}
					</Grid>
				</Box>
			</Box>
			<Footer />
		</ThemeProvider>
	);
}
