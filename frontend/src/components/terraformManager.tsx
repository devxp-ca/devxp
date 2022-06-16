import React from "react";
import {useEffect} from "react";
import Grid from "@mui/material/Grid";
import {resourceSettings} from "../components/terraformOptions";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import typeToResource from "./resources/typeToResource";
import Resource from "./resources/Resource";
import {handleOpenSubmitModalConfirmation} from "./modals/modalHandlers";

import PreviewWindow from "../components/livePreview/previewWindow";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import useMediaQuery from "@mui/material/useMediaQuery";
import {CONFIG} from "../config";
import TerraformManagerModals from "./modals/TerraformManagerModals";
import {removeEmptyKeys} from "../util";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import LabelledTextInput from "./labelledInputs/LabelledTextInput";
import {
	ManagedToolProps,
	partialResource,
	SubmitModalInfoDefaults
} from "./managedToolWrapper";
import BackButton from "./buttons/BackButton";
import ProviderSelector from "./providerSelector";

export default function TerraformManager(props: ManagedToolProps) {
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
	const [selectedSecureOption, setSelectedSecureOption] =
		React.useState(false);
	const [selectedAllowSshOption, setSelectedAllowSshOption] =
		React.useState(true);
	const [selectedAllowEgressWebOption, setSelectedAllowEgressWebOption] =
		React.useState(true);
	const [selectedAllowIngressWebOption, setSelectedAllowIngressWebOption] =
		React.useState(false);
	const [selectedAutoLoadBalanceOption, setSelectedAutoLoadBalanceOption] =
		React.useState(false);
	const [trackedResources, setTrackedResources] = React.useState<
		resourceSettings[]
	>([]);
	const [project, setProject] = React.useState("");
	const [submitModalIsOpen, setSubmitModalIsOpen] = React.useState(false);
	const [submitModalInfo, setSubmitModalInfo] = React.useState(
		SubmitModalInfoDefaults
	);

	const resetRepoData = () => {
		setTrackedResources(selectedRepoSavedData?.settings?.resources ?? []);
		setSelectedProvider(selectedRepoSavedData?.settings?.provider ?? "");
		setSelectedSecureOption(
			selectedRepoSavedData?.settings?.secure ?? false
		);
		setSelectedAllowSshOption(
			selectedRepoSavedData?.settings?.allowSsh ?? true
		);
		setSelectedAllowEgressWebOption(
			selectedRepoSavedData?.settings?.allowEgressWeb ?? true
		);
		setSelectedAllowIngressWebOption(
			selectedRepoSavedData?.settings?.allowIngressWeb ?? false
		);
		setSelectedAutoLoadBalanceOption(
			selectedRepoSavedData?.settings?.autoLoadBalance ?? false
		);
		setProject(selectedRepoSavedData?.settings?.project ?? "");
		setShouldResetData(false);
	};

	React.useEffect(resetRepoData, [selectedRepoSavedData, shouldResetData]);

	//   --------   PREVIEW CHANGES   --------   //

	const [previewData, setPreviewData] = React.useState("");
	const [previewError, setPreviewError] = React.useState(false);
	React.useEffect(() => {
		axios
			.post(
				`${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`,
				removeEmptyKeys({
					preview: true,
					tool: "terraform",
					repo: selectedRepo,
					settings: {
						provider: selectedProvider,
						secure: selectedSecureOption,
						allowSsh: selectedAllowSshOption,
						allowIngressWeb: selectedAllowIngressWebOption,
						allowEgressWeb: selectedAllowEgressWebOption,
						autoLoadBalance: selectedAutoLoadBalanceOption,
						resources: trackedResources,
						project:
							(project ?? "").length > 0 ? project : "PROJECT_ID"
					}
				})
			)
			.then(response => {
				setPreviewData(response.data.preview);
			})
			.catch(err => {
				setPreviewError(true);
				setTimeout(() => setPreviewError(false), 400);
			});
	}, [
		selectedRepoSavedData,
		selectedProvider,
		selectedSecureOption,
		selectedAllowSshOption,
		selectedAllowEgressWebOption,
		selectedAllowIngressWebOption,
		selectedAutoLoadBalanceOption,
		trackedResources
	]);

	//   --------   -------- --------   --------   //

	const [currentResource, setCurrentResource] =
		React.useState<partialResource>();

	//OPTIONS MODAL THINGS
	const [openOptionsModal, setOpenOptionsModal] = React.useState(false);
	//ADVANCED OPTIONS MODAL THINGS
	const [advancedOptionsModalIsOpen, setAdvancedOptionsModalIsOpen] =
		React.useState(false);

	// Info modal for when a user tries to add a resource without choosing a provider
	const [addResourceWarningModalIsOpen, setAddResourceWarningModalIsOpen] =
		React.useState(false);

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
				<TerraformManagerModals
					{...{
						submitModalIsOpen,
						setSubmitModalIsOpen,
						submitModalInfo,
						setSubmitModalInfo,
						selectedRepo,
						selectedProvider,
						selectedSecureOption,
						selectedAllowSshOption,
						selectedAllowIngressWebOption,
						selectedAllowEgressWebOption,
						selectedAutoLoadBalanceOption,
						trackedResources,
						project,
						setSettingsHaveBeenEdited,
						setCurrentResource,
						setTrackedResources,
						currentResource,
						openOptionsModal,
						setOpenOptionsModal,
						overwriteWarningModalIsOpen,
						setOverwriteWarningModalIsOpen,
						setExitWarningModalIsOpen,
						addResourceWarningModalIsOpen,
						setAddResourceWarningModalIsOpen,
						exitWarningModalIsOpen,
						backButton,
						advancedOptionsModalIsOpen,
						setAdvancedOptionsModalIsOpen,
						setSelectedSecureOption,
						settingsHaveBeenEdited,
						setSelectedAllowSshOption,
						setSelectedAllowIngressWebOption,
						setSelectedAllowEgressWebOption,
						setSelectedAutoLoadBalanceOption
					}}
				/>
				<Typography sx={{paddingTop: 4}} variant="h4">
					Terraform
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
								disabled={trackedResources.length > 0}
								onChange={(value: string) => {
									setSelectedProvider(value);
									setSettingsHaveBeenEdited(true);
								}}
								initial={selectedProvider}
							/>
							{selectedProvider === "google" && (
								<LabelledTextInput
									direction="row"
									text="Google Project ID"
									description={
										<p>
											To locate your project ID:
											<ol>
												<li>
													Go to the
													<Link
														href="https://console.cloud.google.com/home/dashboard"
														target="_blank"
														rel="noopener">
														{" "}
														API Console
													</Link>
													.
												</li>
												<li>
													From the projects list,
													select Manage all projects.
													The names and IDs for all
													the projects you're a member
													of are displayed.
												</li>
											</ol>
											<Link
												href="https://support.google.com/googleapi/answer/7014113?hl=en"
												target="_blank"
												rel="noopener">
												Learn more.
											</Link>
										</p>
									}
									pattern="^[a-zA-Z][a-zA-Z0-9-_]{5}[a-zA-Z0-9-_]*$"
									initial={project}
									onChange={(val: string) => {
										setProject(val);
										setSettingsHaveBeenEdited(true);
									}}
								/>
							)}
						</Grid>
						<Grid item xs={1}>
							<IconButton
								onClick={() => {
									setAdvancedOptionsModalIsOpen(true);
								}}
								disabled={
									selectedProvider === "aws" ? false : true
								}>
								<Tooltip title="Advanced Options">
									<SettingsIcon />
								</Tooltip>
							</IconButton>
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
				<Card>
					<CardActionArea
						onClick={() => {
							if (selectedProvider) {
								setOpenOptionsModal(true);
							} else {
								setAddResourceWarningModalIsOpen(true);
							}
						}}
						sx={{
							backgroundColor: "secondary.light",
							"&:hover": {
								backgroundColor: "success.dark"
							}
						}}>
						<Grid
							container
							justifyContent="center"
							alignItems="center"
							sx={{
								width: (defaultCardSize / 3) * 2 - 16,
								height: defaultCardSize,
								borderWidth: 1,
								borderColor: "success.main",
								borderStyle: "solid",
								borderRadius: 1
							}}>
							<Grid item>
								<AddIcon
									sx={{
										width: 75,
										height: 75,
										opacity: 1,
										color: "success.main"
									}}
								/>
							</Grid>
						</Grid>
					</CardActionArea>
				</Card>
				{trackedResources.map((resource, index) => (
					<Grid item key={`prevInstanceCardGrid${index}`}>
						{(
							typeToResource(resource, true) as Resource<any, any>
						).toCard(() => {
							setCurrentResource(resource);
							setTrackedResources(
								trackedResources.filter((r, i) => i !== index)
							);
						}, defaultCardSize)}
					</Grid>
				))}
			</Grid>
			{isMobile === false && (
				<PreviewWindow data={previewData} error={previewError} />
			)}
		</>
	);
}
