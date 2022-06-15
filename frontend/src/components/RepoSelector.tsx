import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import React, {Dispatch} from "react";
import {terraformDataSettings} from "./terraformOptions";

export default ({
	repoList,
	selectedRepo,
	updateSelectedRepo,
	selectedRepoSavedData,
	settingsHaveBeenEdited,
	giveOverwriteWarning,
	setOverwriteWarningModalIsOpen,
	setGiveOverwriteWarning,
	setCopyRepoModalIsOpen,
	setHeadsUpModalIsOpen,
	setPreviousRepo
}: {
	repoList: any[];
	selectedRepo: string;
	updateSelectedRepo: (s: string) => void;
	selectedRepoSavedData: terraformDataSettings | null;
	settingsHaveBeenEdited: boolean;
	giveOverwriteWarning: boolean;
	setOverwriteWarningModalIsOpen: Dispatch<boolean>;
	setGiveOverwriteWarning: Dispatch<boolean>;
	setCopyRepoModalIsOpen: Dispatch<boolean>;
	setHeadsUpModalIsOpen: Dispatch<boolean>;
	setPreviousRepo: Dispatch<string>;
}) => {
	const [giveCopyWarning, setGiveCopyWarning] = React.useState(true);

	return (
		<Grid
			container
			display="flex"
			alignItems="center"
			columns={2}
			spacing={2}
			sx={{width: "inherit"}}>
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
								setHeadsUpModalIsOpen(true);
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
