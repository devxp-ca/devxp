import * as React from "react";
import {Button, Grid, Autocomplete, TextField} from "@mui/material";
import GenericModal from "./GenericModal";
import axios from "axios";
import {CONFIG} from "../../config";

function copySettings(
	selectedRepo: string,
	copyRepo: string,
	setShowLoadingModal: (value: boolean) => void
) {
	setShowLoadingModal(true);
	axios
		.get(`${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`, {
			headers: {
				repo: `${selectedRepo}`
			}
		})
		.then((response: any) => {
			return axios.post(`${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`, {
				repo: `${copyRepo}`,
				tool: "terraform",
				settings: response.data.settings
			});
		})
		.then(() => {
			setShowLoadingModal(false);
			// TODO: Success modal. Don't have time right now
		})
		.catch((error: any) => {
			setShowLoadingModal(false);
			console.error(error);
		});
}

interface modalProps {
	isOpen: boolean;
	handleClose: () => void;
	repoList: any[];
	selectedRepo: string;
	setShowLoadingModal: (value: boolean) => void;
}

export default function CopyRepoSettingsModal({
	isOpen,
	handleClose,
	repoList,
	selectedRepo,
	setShowLoadingModal
}: modalProps) {
	const [copyRepo, setCopyRepo] = React.useState<string>("");
	return (
		<GenericModal
			isOpen={isOpen}
			handleClose={handleClose}
			title="Copy Settings"
			bodyText="Select the repo you would like to copy settings to. Note: the settings of the destination repo will be overwritten."
			children={
				<Grid
					container
					direction="column"
					style={{display: "flex", justifyContent: "center"}}>
					<Autocomplete
						sx={{margin: 3, width: "300px"}}
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
							setCopyRepo(value?.full_name ?? "");
						}}
						isOptionEqualToValue={(option: any, value: any) => {
							return option?.full_name === value?.full_name;
						}}
					/>
					<Grid style={{display: "flex", justifyContent: "center"}}>
						<Button variant="contained" onClick={handleClose}>
							Cancel
						</Button>
						<Button
							variant="contained"
							onClick={() => {
								handleClose();
								copySettings(
									selectedRepo,
									copyRepo,
									setShowLoadingModal
								);
							}}>
							Copy Settings
						</Button>
					</Grid>
				</Grid>
			}
		/>
	);
}
