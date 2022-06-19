import React from "react";
import {useEffect} from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import {handleOpenSubmitModalConfirmation} from "./modals/modalHandlers";

import PreviewWindow from "../components/livePreview/previewWindow";
import useMediaQuery from "@mui/material/useMediaQuery";
import {ManagedToolProps, SubmitModalInfoDefaults} from "./managedToolWrapper";
import BackButton from "./buttons/BackButton";
import ProviderSelector from "./providerSelector";
import Pipeline from "./Pipeline";
import ManagedToolModals from "./modals/ManagedToolModals";
import PipelineToolModals from "./modals/PipelineToolModals";

export type Job = {
	type: "terraform";
	provider: "google" | "aws" | "azure";
};

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

	console.dir(selectedRepoSavedData);

	const [selectedProvider, setSelectedProvider] = React.useState(
		selectedRepoSavedData?.settings?.provider ?? ""
	);

	const [submitModalIsOpen, setSubmitModalIsOpen] = React.useState(false);
	const [submitModalInfo, setSubmitModalInfo] = React.useState(
		SubmitModalInfoDefaults
	);

	///////////////////

	const [terraformPipeline, setTerraformPipeline] = React.useState(
		selectedRepoSavedData?.pipelines?.jobs?.reduce(
			(acc: boolean, cur: any) => acc || cur.type === "terraform",
			false
		) ?? false
	);

	///////////////////

	React.useEffect(() => {
		setShouldResetData(false);
		setSelectedProvider(selectedRepoSavedData?.settings?.provider ?? "");
		setTerraformPipeline(
			selectedRepoSavedData?.pipelines?.jobs?.reduce(
				(acc: boolean, cur: any) => acc || cur.type === "terraform",
				false
			) ?? false
		);
	}, [selectedRepoSavedData, shouldResetData]);

	React.useEffect(() => {
		if (prButtonClicked) {
			handleOpenSubmitModalConfirmation(
				setSubmitModalInfo,
				setSubmitModalIsOpen,
				selectedRepo
			)();
			setPrButtonClicked(false);
		}
	}, [prButtonClicked]);

	//   --------   PREVIEW CHANGES   --------   //

	const [previewData, setPreviewData] = React.useState("");
	const [previewError, setPreviewError] = React.useState(false);
	React.useEffect(() => {}, [
		selectedRepoSavedData,
		selectedProvider,
		terraformPipeline
	]);

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
			<Grid container direction="row">
				<ManagedToolModals
					{...{
						setSettingsHaveBeenEdited,
						overwriteWarningModalIsOpen,
						setOverwriteWarningModalIsOpen,
						exitWarningModalIsOpen,
						setExitWarningModalIsOpen,
						backButton
					}}
				/>
				<PipelineToolModals
					{...{
						submitModalIsOpen,
						setSubmitModalIsOpen,
						submitModalInfo,
						setSubmitModalInfo,
						selectedRepo,
						selectedProvider,
						setSettingsHaveBeenEdited,
						jobs: [
							terraformPipeline
								? {
										type: "terraform",
										provider: selectedProvider
								  }
								: undefined
						].filter(j => !!j) as Job[]
					}}
				/>
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
								disabled={
									!!selectedRepoSavedData?.settings?.provider
								}
								onChange={(value: string) => {
									setSelectedProvider(value);
									setSettingsHaveBeenEdited(true);
								}}
								initial={selectedProvider}
								selectedRepo={
									selectedRepo !== ""
										? selectedRepo
										: undefined
								}
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
				<Grid
					container
					direction="column"
					sx={{
						width: "80vw",
						height: "50vh",
						gridGap: "1rem",
						flexWrap: "nowrap",
						"& .arrow:last-of-type": {
							display: "none"
						}
					}}>
					<Pipeline
						disabled={true}
						title="Test"
						description="Coming soon"
					/>
					<Pipeline
						disabled={true}
						title="Build"
						description="Coming soon"
						secondary={true}
					/>
					<Pipeline
						title="Invoke"
						description="Invoke your cloud infastructure using Terraform"
						onChange={val => {
							setSettingsHaveBeenEdited(true);
							setTerraformPipeline(val);
						}}
						initial={terraformPipeline}
					/>
					<Pipeline
						title="Deploy"
						description="Coming soon"
						disabled={true}
						secondary={true}
					/>
				</Grid>
			</Grid>
			{isMobile === false && (
				<PreviewWindow data={previewData} error={previewError} />
			)}
		</>
	);
}
