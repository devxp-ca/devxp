import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import React, {Dispatch, useEffect} from "react";
import {CONFIG} from "../config";
import CopyRepoSettingsModal from "./modals/CopyRepoSettingsModal";
import LoadingModal from "./modals/LoadingModal";
import OkCancelModal from "./modals/OkCancelModal";
import {terraformDataSettings} from "./terraformOptions";

export default ({
	settingsHaveBeenEdited,
	giveOverwriteWarning,
	setOverwriteWarningModalIsOpen,
	setGiveOverwriteWarning,
	setSettingsHaveBeenEdited,
	selectedRepoSavedData,
	setSelectedRepoSavedData,
	onRepoChange
}: {
	settingsHaveBeenEdited: boolean;
	giveOverwriteWarning: boolean;
	setOverwriteWarningModalIsOpen: Dispatch<boolean>;
	setGiveOverwriteWarning: Dispatch<boolean>;
	setSettingsHaveBeenEdited: Dispatch<boolean>;
	selectedRepoSavedData: any;
	setSelectedRepoSavedData: Dispatch<any>;
	onRepoChange?: ((repo: string) => void) | Dispatch<string>;
}) => {
	const [giveCopyWarning, setGiveCopyWarning] = React.useState(true);

	const [repoList, setRepoList] = React.useState([]);
	const [selectedRepo, setSelectedRepo] = React.useState<string>("");
	const [previousRepo, setPreviousRepo] = React.useState<string>("");
	const [tempRepoData, setTempRepoData] =
		React.useState<terraformDataSettings | null>(null);
	const [showLoadingModal, setShowLoadingModal] = React.useState(false);

	// If the user comes from "no selected repo" and switches to repo with
	// saved settings, give them a choice to back out or let the local changes be overwritten
	const [overwriteChoiceModalIsOpen, setOverwriteChoiceModalIsOpen] =
		React.useState(false);

	useEffect(() => {
		if (onRepoChange) {
			onRepoChange(selectedRepo);
		}
	}, [selectedRepo]);

	const [copyRepoModalIsOpen, setCopyRepoModalIsOpen] = React.useState(false);

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
				if (selectedRepoSavedData) {
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

	useEffect(() => {
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
		<Grid
			container
			display="flex"
			alignItems="center"
			columns={2}
			spacing={2}
			sx={{width: "inherit"}}>
			<LoadingModal
				isOpen={showLoadingModal}
				loadingTitle={"Loading..."}
			/>
			<CopyRepoSettingsModal
				isOpen={copyRepoModalIsOpen}
				handleClose={() => {
					setCopyRepoModalIsOpen(false);
				}}
				repoList={repoList}
				selectedRepo={selectedRepo}
				setShowLoadingModal={setShowLoadingModal}
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
				title={"Warning: This repo has saved settings."}
				bodyText={
					"Continuing will overwrite your currently unsaved settings."
				}
			/>

			<Grid item>
				<Autocomplete
					sx={{width: "250px"}}
					id="repo-select"
					disableClearable={true}
					options={repoList}
					value={{full_name: selectedRepo}}
					getOptionLabel={(option: any) => option?.full_name ?? ""}
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
							setOverwriteWarningModalIsOpen(true);
						}
					}}
					onChange={(event: any, value: any) => {
						setPreviousRepo(selectedRepo);
						updateSelectedRepo(value?.full_name ?? "");
					}}
					isOptionEqualToValue={(option: any, value: any) => {
						return option?.full_name === value?.full_name;
					}}
				/>
			</Grid>
			<Grid item>
				<Tooltip title="Click here to copy these settings to another repo">
					<Button
						sx={{
							":hover": {
								bgcolor: "secondary.main",
								opacity: 0.9
							}
						}}
						variant="contained"
						color="secondary"
						onClick={() => {
							if (settingsHaveBeenEdited && giveCopyWarning) {
								setGiveCopyWarning(false);
							} else {
								setCopyRepoModalIsOpen(true);
							}
						}}>
						Copy to another repo
					</Button>
				</Tooltip>
			</Grid>
		</Grid>
	);
};
