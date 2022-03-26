import * as React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {lightTheme} from "../style/themes";
import {darkTheme} from "../style/themes";
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
import OkModal from "../components/modals/OkModal";
import OkCancelModal from "../components/modals/OkCancelModal";
import {handleCloseModal} from "../components/modals/modalHandlers";
import LoadingModal from "../components/modals/loadingModal";
import CopyRepoSettingsModal from "../components/modals/CopyRepoSettingsModal";

import terraformPNG from "../assets/Terraform_Vertical.png";

export default function ToolManager() {
	const [repoList, setRepoList] = React.useState([]);
	// The repo we are currently configuring
	const [selectedRepo, setSelectedRepo] = React.useState<string>("");
	const [previousRepo, setPreviousRepo] = React.useState<string>("");
	const [selectedRepoSavedData, setSelectedRepoSavedData] =
		React.useState<terraformDataSettings | null>(null);
	const [tempRepoData, setTempRepoData] =
		React.useState<terraformDataSettings | null>(null);

	const [selectedTool, setSelectedTool] = React.useState<string>("none");

	const updateSelectedRepo = (repoName: string) => {
		setShowLoadingModal(true);
		axios
			.get(`${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`, {
				headers: {
					repo: repoName
				}
			})
			.then((response: any) => {
				setShowLoadingModal(false);
				if (!selectedRepoSavedData && settingsHaveBeenEdited) {
					setTempRepoData(response.data);
					setOverwriteChoiceModalIsOpen(true);
				} else {
					setSelectedRepoSavedData(response.data);
					setSettingsHaveBeenEdited(false);
				}
			})
			.catch((error: any) => {
				setShowLoadingModal(false);
				if (!!selectedRepoSavedData) {
					// Clean slate
					setSelectedRepoSavedData(null);
					setSettingsHaveBeenEdited(false);
				}
				console.error(error);
			})
			.finally(() => {
				setSelectedRepo(repoName);
				setGiveOverwriteWarning(true);
			});
	};

	const setSelectedToolCardCallback = (tool_name: string) => {
		const callback = () => {
			setSelectedTool(tool_name);
		};
		return callback;
	};

	/* For control flow logic (loading/overwriting/copying) */
	const [overwriteWarningModalIsOpen, setOverwriteWarningModalIsOpen] =
		React.useState(false);
	// We give a warning when a user tries to switch repos with unsaved settings
	const [giveOverwriteWarning, setGiveOverwriteWarning] =
		React.useState(true);
	// If the user comes from "no selected repo" and switches to repo with
	// saved settings, give them a choice to back out or let the local changes be overwritten
	const [overwriteChoiceModalIsOpen, setOverwriteChoiceModalIsOpen] =
		React.useState(false);
	const [showLoadingModal, setShowLoadingModal] = React.useState(false);
	const [settingsHaveBeenEdited, setSettingsHaveBeenEdited] =
		React.useState(false);
	const [headsUpModalIsOpen, setHeadsUpModalIsOpen] = React.useState(false);
	// We give a warning when a user tries to copy a repo with unsaved settings
	const [giveCopyWarning, setGiveCopyWarning] = React.useState(true);

	/* For the copy settings modal */
	const [copyRepoModalIsOpen, setCopyRepoModalIsOpen] = React.useState(false);

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
					<Navbar />
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
						sx={{mt: 3}}>
						<Grid item>
							<Autocomplete
								sx={{ml: 1, width: "300px"}}
								id="repo-select"
								disableClearable={true}
								options={repoList}
								value={{full_name: selectedRepo}}
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
								onOpen={() => {
									if (
										!!selectedRepoSavedData &&
										settingsHaveBeenEdited &&
										giveOverwriteWarning
									) {
										setGiveOverwriteWarning(false);
										setOverwriteWarningModalIsOpen(
											true
										);
									}
								}}
								onChange={(event: any, value: any) => {
									setPreviousRepo(selectedRepo);
									updateSelectedRepo(
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
							<OkModal
								isOpen={overwriteWarningModalIsOpen}
								handleClose={handleCloseModal(
									setOverwriteWarningModalIsOpen
								)}
								title={"Heads up!"}
								bodyText={
									"It looks like you have uncommitted changes.\
									If you select a new repo, your uncommited changes will be lost.\
									Consider creating a pull request before changing repos."
								}
							/>
							<OkCancelModal
								isOpen={overwriteChoiceModalIsOpen}
								onOk={() => {
									setSelectedRepoSavedData(tempRepoData);
									setSettingsHaveBeenEdited(false);
									setOverwriteChoiceModalIsOpen(false);
								}}
								onCancel={() => {
									setSelectedRepo(previousRepo);
									setOverwriteChoiceModalIsOpen(false);
								}}
								title={
									"Warning: This repo has saved settings."
								}
								bodyText={
									"Continuing will overwrite your currently unsaved settings."
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
										if (
											settingsHaveBeenEdited &&
											giveCopyWarning
										) {
											setHeadsUpModalIsOpen(true);
											setGiveCopyWarning(false);
										} else {
											setCopyRepoModalIsOpen(true);
										}
									}}>
									Copy to another repo
								</Button>
							</Tooltip>
							<CopyRepoSettingsModal
								isOpen={copyRepoModalIsOpen}
								handleClose={() => {
									setCopyRepoModalIsOpen(false);
								}}
								repoList={repoList}
								selectedRepo={selectedRepo}
								setShowLoadingModal={setShowLoadingModal}
							/>
							<OkModal
								isOpen={headsUpModalIsOpen}
								handleClose={handleCloseModal(
									setHeadsUpModalIsOpen
								)}
								title={"Heads Up!"}
								bodyText={
									"It looks like you have unsubmitted changes. Unsubmitted changes will not be copied to other repos."
								}
							/>
						</Grid>
					</Grid>
					{selectedTool == "none" && (
						<Grid container direction="row" sx={{paddingTop: 3}}>
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
							repoData={selectedRepoSavedData}
							setSettingsHaveBeenEdited={
								setSettingsHaveBeenEdited
							}
							settingsHaveBeenEdited={settingsHaveBeenEdited}
						/>
					)}
				</Grid>
				<Footer />
			</Grid>
		</ThemeProvider>
	);
}
