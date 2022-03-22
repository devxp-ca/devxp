import * as React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {lightTheme} from "../style/themes";
import axios from "axios";
import {CONFIG} from "../config";
import ToolManagerCard from "../components/toolManagerCard";
import TerraformManager from "../components/terraformManager";
import {terraformDataSettings} from "../components/terraformOptions";
import {
	Box,
	ThemeProvider,
	Autocomplete,
	TextField,
	Button,
	Tooltip,
	Grid
} from "@mui/material";
import GenericModal from "../components/modals/GenericModal";
import YesNoModal from "../components/modals/yesNoModal";
import {handleCloseModal} from "../components/modals/modalHandlers";
import LoadingModal from "../components/modals/loadingModal";

import terraformPNG from "../assets/Terraform_Vertical.png";

export default function ToolManager() {
	const [repoList, setRepoList] = React.useState([]);
	const [selectedRepo, setSelectedRepo] = React.useState<string>("");
	const [selectedRepoCurrentData, setSelectedRepoCurrentData] =
		React.useState<terraformDataSettings | null>(null);
	const [selectedRepoSavedData, setSelectedRepoSavedData] =
		React.useState<terraformDataSettings | null>(null);

	const [selectedTool, setSelectedTool] = React.useState<string>("none");

	const setSelectedRepoFromAutocomplete = (repo_full_name: string) => {
		setSelectedRepo(repo_full_name);
		if (repo_full_name === "") {
			setSelectedRepoSavedData(null);
			setOverwriteModalIsOpen(true);
			return;
		}
		setShowLoadingModal(true);
		axios
			.get(`${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`, {
				headers: {
					repo: repo_full_name
				}
			})
			.then((response: any) => {
				setShowLoadingModal(false);
				setLoadRepoDataModalIsOpen(true);
				setSelectedRepoSavedData(response.data);
			})
			.catch((error: any) => {
				setShowLoadingModal(false);
				setSelectedRepoSavedData(null);
				setOverwriteModalIsOpen(true);
				console.error(error);
			});
	};

	const setSelectedToolCardCallback = (tool_name: string) => {
		const callback = () => {
			setSelectedTool(tool_name);
		};
		return callback;
	};

	/* For control flow logic (loading/overwriting/copying) */
	const [loadRepoDataModalIsOpen, setLoadRepoDataModalIsOpen] =
		React.useState(false);
	const [overwriteModalIsOpen, setOverwriteModalIsOpen] =
		React.useState(false);
	const [showLoadingModal, setShowLoadingModal] = React.useState(false);

	/* For the copy settings modal */
	const [copyRepo, setCopyRepo] = React.useState<string>("");
	const [copyRepoOpen, setCopyRepoOpen] = React.useState(false);

	const setRepoForCopy = () => {
		axios
			.get(`${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`, {
				headers: {
					repo: `${selectedRepo}`
				}
			})
			.then((response: any) => {
				return axios.post(
					`${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`,
					{
						repo: `${copyRepo}`,
						tool: "terraform",
						settings: response.data.settings
					}
				);
			})
			.then((response: any) => {
				setCopyRepoOpen(false);
			})
			.catch((error: any) => {
				console.error(error);
			});
	};

	const copyModalChildren = () => {
		return (
			<Grid
				container
				direction="column"
				style={{display: "flex", justifyContent: "center"}}>
				<Autocomplete
					sx={{margin: 3, width: "300px"}}
					id="repo-select"
					options={repoList}
					getOptionLabel={(option: any) => option?.full_name ?? ""}
					renderInput={(params: any) => (
						<TextField
							{...params}
							label="Select A Repo"
							variant="outlined"
						/>
					)}
					onChange={(event: any, value: any) => {
						setCopyRepo(value?.full_name ?? "");
					}}
					isOptionEqualToValue={(option: any, value: any) => {
						return option?.full_name === value?.full_name;
					}}
				/>
				<Button variant="contained" onClick={setRepoForCopy}>
					Copy Settings
				</Button>
			</Grid>
		);
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
							sx={{mt: 3}}>
							<Grid item>
								<Autocomplete
									sx={{ml: 1, width: "300px"}}
									id="repo-select"
									options={repoList}
									getOptionLabel={(option: any) =>
										option?.full_name ?? ""
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
											value?.full_name ?? ""
										);
									}}
									isOptionEqualToValue={(
										option: any,
										value: any
									) => {
										return (
											option?.full_name ===
											value?.full_name
										);
									}}
								/>
								<YesNoModal
									isOpen={loadRepoDataModalIsOpen}
									handleClose={handleCloseModal(
										setLoadRepoDataModalIsOpen
									)}
									onYes={() => {
										setSelectedRepoCurrentData(
											selectedRepoSavedData
										);
										setLoadRepoDataModalIsOpen(false);
									}}
									onNo={handleCloseModal(
										setLoadRepoDataModalIsOpen
									)}
									title={`${
										selectedRepo ?? "This repo"
									} has settings already saved. Would you like to load them?`}
									bodyText={
										"Selecting YES will undo any currently unsaved changes."
									}
								/>
								<YesNoModal
									isOpen={overwriteModalIsOpen}
									handleClose={handleCloseModal(
										setOverwriteModalIsOpen
									)}
									onYes={() => {
										setSelectedRepoCurrentData(null);
										setOverwriteModalIsOpen(false);
									}}
									onNo={handleCloseModal(
										setOverwriteModalIsOpen
									)}
									title={
										"Would you like to discard your unsaved settings?"
									}
								/>
							</Grid>
							<Grid>
								<LoadingModal
									isOpen={showLoadingModal}
									loadingTitle={"Loading..."}
								/>
							</Grid>
							<Grid item>
								<Tooltip title="Click here to copy these settings to another repo">
									<Button
										disabled={!selectedRepoSavedData}
										variant="contained"
										onClick={() => {
											setCopyRepoOpen(true);
										}}>
										Copy to another repo
									</Button>
								</Tooltip>
								<GenericModal
									isOpen={copyRepoOpen}
									handleClose={() => {
										setCopyRepoOpen(false);
									}}
									title="Copy Settings"
									bodyText="Select the repo you want to copy the settings to"
									children={copyModalChildren()}
								/>
							</Grid>
						</Grid>
						{selectedTool == "none" && (
							<Grid
								container
								direction="row"
								sx={{paddingTop: 3}}>
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
								backButton={setSelectedToolCardCallback("none")}
								repoData={selectedRepoCurrentData}
							/>
						)}
					</Grid>
				</Box>
			</Box>
			<Footer />
		</ThemeProvider>
	);
}
