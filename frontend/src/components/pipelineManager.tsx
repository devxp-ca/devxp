import React from "react";
import {useEffect} from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import {handleOpenSubmitModalConfirmation} from "./modals/modalHandlers";

import PreviewWindow from "../components/livePreview/previewWindow";
import useMediaQuery from "@mui/material/useMediaQuery";
import {ManagedToolProps, SubmitModalInfoDefaults} from "./managedToolWrapper";
import BackButton from "./buttons/BackButton";
import ProviderSelector from "./providerSelector";

export default function PipelineManager(props: ManagedToolProps) {
	const {
		overwriteWarningModalIsOpen,
		exitWarningModalIsOpen,
		selectedRepo,
		prButtonClicked,
		defaultCardSize,
		setSettingsHaveBeenEdited,
		settingsHaveBeenEdited,
		setOverwriteWarningModalIsOpen,
		setExitWarningModalIsOpen,
		setPrButtonClicked,
		selectedRepoSavedData,
		backButton,
		shouldResetData,
		setShouldResetData
	} = props;

	const [selectedProvider, setSelectedProvider] = React.useState("");

	const [submitModalIsOpen, setSubmitModalIsOpen] = React.useState(false);
	const [submitModalInfo, setSubmitModalInfo] = React.useState(
		SubmitModalInfoDefaults
	);

	const resetRepoData = () => {
		setShouldResetData(false);
		setSelectedProvider(selectedRepoSavedData?.settings?.provider ?? "");
	};

	React.useEffect(resetRepoData, [selectedRepoSavedData, shouldResetData]);

	//   --------   PREVIEW CHANGES   --------   //

	const [previewData, setPreviewData] = React.useState("");
	const [previewError, setPreviewError] = React.useState(false);
	React.useEffect(() => {}, [selectedRepoSavedData, selectedProvider]);

	//   --------   -------- --------   --------   //

	//True if screen width > 600px, else false
	const isMobile = useMediaQuery("(max-width:600px)");

	useEffect(() => {
		if (prButtonClicked) {
			handleOpenSubmitModalConfirmation(
				setSubmitModalInfo,
				setSubmitModalIsOpen,
				selectedRepo
			)();
			setPrButtonClicked(false);
		}
	}, [prButtonClicked]);

	return (
		<>
			<Grid item>
				<Typography sx={{paddingTop: 4}} variant="h4">
					Pipelines
				</Typography>
				<FormControl>
					<Grid
						container
						direction={isMobile ? "column" : "row"}
						sx={{
							paddingLeft: 4,
							paddingTop: 4.5,
							marginBottom: 2,
							flexWrap: isMobile === true ? "inherit" : "wrap"
						}}>
						<Grid
							item
							xs={11}
							justifyContent="center"
							alignItems="center">
							<ProviderSelector
								onChange={(value: string) => {
									setSelectedProvider(value);
									setSettingsHaveBeenEdited(true);
								}}
								initial={selectedProvider}
							/>
						</Grid>
					</Grid>
				</FormControl>
			</Grid>
			<Grid
				container
				direction="row"
				sx={{
					gridGap: "2vw"
				}}>
				<BackButton
					defaultCardSize={defaultCardSize}
					onClick={() => {
						if (settingsHaveBeenEdited) {
							setExitWarningModalIsOpen(true);
						} else {
							backButton();
						}
					}}
				/>
			</Grid>
			{isMobile === false && (
				<PreviewWindow data={previewData} error={previewError} />
			)}
		</>
	);
}
