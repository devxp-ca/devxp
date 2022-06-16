import React, {Dispatch} from "react";
import {useEffect} from "react";
import {Box} from "@mui/system";
import Grid from "@mui/material/Grid";
import {
	resourceSettings,
	terraformDataSettings
} from "../components/terraformOptions";

import useMediaQuery from "@mui/material/useMediaQuery";
import RepoSelector from "./RepoSelector";
import BottomActionButtons from "./buttons/BottomActionButtons";

export type partialResource = resourceSettings | {type: string} | undefined;
export interface BackendError {
	timestamp: Date;

	//HTTP Status
	status: number;

	//Error type / high level description
	error: string;

	//Path which created error
	path: string;

	//Detailed error message
	message?: string;
}

export interface SubmitModalInfoInterface {
	isSubmitModal: boolean;
	isSuccessModal: boolean;
	title: string;
	body: string;
	loading: boolean;
	width: string;
}
export const SubmitModalInfoDefaults: SubmitModalInfoInterface = {
	isSubmitModal: true,
	isSuccessModal: false,
	title: "",
	body: "",
	loading: false,
	width: ""
};

export interface ManagedToolProps {
	pullRequestDisabled: boolean;
	setPullRequestDisabled: Dispatch<boolean>;
	shouldResetData: boolean;
	setShouldResetData: Dispatch<boolean>;
	overwriteWarningModalIsOpen: boolean;
	exitWarningModalIsOpen: boolean;
	selectedRepoSavedData: any;
	setSelectedRepoSavedData: Dispatch<any>;
	backButton: () => void;
	selectedRepo: string;
	prButtonClicked: boolean;
	defaultCardSize: number;
	setSettingsHaveBeenEdited: Dispatch<boolean>;
	settingsHaveBeenEdited: boolean;
	setOverwriteWarningModalIsOpen: Dispatch<boolean>;
	setExitWarningModalIsOpen: Dispatch<boolean>;
	setPrButtonClicked: Dispatch<boolean>;
}
export type ManagedToolPropsMin = ManagedToolProps | {};
export const hasProps = (p: ManagedToolPropsMin): p is ManagedToolProps =>
	"selectedRepo" in p;

export default function ManagedToolWrapper(props: {
	backButton: () => void;
	children: (props: ManagedToolProps) => React.ReactNode;
}) {
	const defaultCardSize = 250;

	/* For control flow logic (loading/overwriting/copying) */
	const [overwriteWarningModalIsOpen, setOverwriteWarningModalIsOpen] =
		React.useState(false);

	const [selectedRepo, setSelectedRepo] = React.useState<string>("");
	const [selectedRepoSavedData, setSelectedRepoSavedData] =
		React.useState<terraformDataSettings | null>(null);

	// We give a warning when a user tries to switch repos with unsaved settings
	const [giveOverwriteWarning, setGiveOverwriteWarning] =
		React.useState(true);
	const [settingsHaveBeenEdited, setSettingsHaveBeenEdited] =
		React.useState(false);
	// We give a warning when a user tries to copy a repo with unsaved settings
	useEffect(() => {
		window.onbeforeunload = () => {
			if (settingsHaveBeenEdited) {
				return "Are you sure you want to leave without submitting your configuration?";
			}
		};
	}, [settingsHaveBeenEdited]);

	//end control flow logic

	const [prButtonClicked, setPrButtonClicked] = React.useState(false);
	const [exitWarningModalIsOpen, setExitWarningModalIsOpen] =
		React.useState(false);

	const [pullRequestDisabled, setPullRequestDisabled] = React.useState(true);
	const [shouldResetData, setShouldResetData] = React.useState(false);

	useEffect(() => {
		window.onbeforeunload = () => {
			if (settingsHaveBeenEdited) {
				return "Are you sure you want to leave without submitting your configuration?";
			}
		};
	}, [settingsHaveBeenEdited]);

	//True if screen width > 600px, else false
	const isMobile = useMediaQuery("(max-width:600px)");

	return (
		<Box
			id="topMostBox"
			justifyContent={isMobile ? "center" : "flex-start"}
			alignItems="center"
			sx={{width: "100%", paddingBottom: 12}}>
			<RepoSelector
				{...{
					settingsHaveBeenEdited,
					giveOverwriteWarning,
					setOverwriteWarningModalIsOpen,
					setGiveOverwriteWarning,
					setSettingsHaveBeenEdited,
					selectedRepoSavedData,
					setSelectedRepoSavedData,
					onRepoChange: setSelectedRepo
				}}
			/>
			<Grid
				item
				container
				direction="row"
				spacing={2}
				sx={{
					paddingTop: 2,
					marginLeft: 0,
					width: "inherit",
					paddingRight: 2
				}}>
				<Grid container direction="column">
					{props.children &&
						props.children({
							pullRequestDisabled,
							setPullRequestDisabled,
							shouldResetData,
							setShouldResetData,
							overwriteWarningModalIsOpen,
							exitWarningModalIsOpen,
							selectedRepoSavedData,
							setSelectedRepoSavedData,
							backButton: props.backButton,
							selectedRepo,
							prButtonClicked,
							setPrButtonClicked,
							defaultCardSize,
							setSettingsHaveBeenEdited,
							settingsHaveBeenEdited,
							setOverwriteWarningModalIsOpen,
							setExitWarningModalIsOpen
						})}
				</Grid>
			</Grid>
			<BottomActionButtons
				pullRequestDisabled={!settingsHaveBeenEdited}
				pullRequestOnClick={() => setPrButtonClicked(true)}
				discardDisabled={!settingsHaveBeenEdited}
				discardOnClick={() => {
					setSettingsHaveBeenEdited(false);
					setShouldResetData(true);
				}}
			/>
		</Box>
	);
}
