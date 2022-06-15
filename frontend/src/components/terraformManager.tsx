import React from "react";
import {useEffect} from "react";
import Button from "@mui/material/Button";
import {Box} from "@mui/system";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
	resourceSettings,
	terraformDataSettings
} from "../components/terraformOptions";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import LabelledRadioSelect from "./labelledInputs/LabelledRadioSelect";
import typeToResource from "./resources/typeToResource";
import Resource from "./resources/Resource";
import {handleOpenSubmitModalConfirmation} from "./modals/modalHandlers";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
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

export default function TerraformManager(props: {backButton: () => void}) {
	const defaultCardSize = 250;

	//start repo state
	const [repoList, setRepoList] = React.useState([]);
	const [selectedRepo, setSelectedRepo] = React.useState<string>("");
	const [previousRepo, setPreviousRepo] = React.useState<string>("");
	const [selectedRepoSavedData, setSelectedRepoSavedData] =
		React.useState<terraformDataSettings | null>(null);
	const [tempRepoData, setTempRepoData] =
		React.useState<terraformDataSettings | null>(null);
	//end repo state

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
	//end control flow logic

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
	};

	React.useEffect(resetRepoData, [selectedRepoSavedData]);

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

	//SUBMIT MODAL THINGS
	const [submitModalIsOpen, setSubmitModalIsOpen] = React.useState(false);
	const [submitModalInfo, setSubmitModalInfo] = React.useState(
		SubmitModalInfoDefaults
	);

	//OPTIONS MODAL THINGS
	const [openOptionsModal, setOpenOptionsModal] = React.useState(false);
	//ADVANCED OPTIONS MODAL THINGS
	const [advancedOptionsModalIsOpen, setAdvancedOptionsModalIsOpen] =
		React.useState(false);

	// Info modal for when a user tries to add a resource without choosing a provider
	const [addResourceWarningModalIsOpen, setAddResourceWarningModalIsOpen] =
		React.useState(false);
	const [exitWarningModalIsOpen, setExitWarningModalIsOpen] =
		React.useState(false);

	useEffect(() => {
		window.onbeforeunload = () => {
			if (settingsHaveBeenEdited) {
				return "Are you sure you want to leave without submitting your configuration?";
			}
		};
	}, [settingsHaveBeenEdited]);

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

	//True if screen width > 600px, else false
	const isMobile = useMediaQuery("(max-width:600px)");

	return (
		<Box
			id="topMostBox"
			justifyContent={isMobile ? "center" : "flex-start"}
			alignItems="center"
			sx={{width: "100%", paddingBottom: 12}}>
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
					overwriteChoiceModalIsOpen,
					setOverwriteChoiceModalIsOpen,
					setSelectedRepoSavedData,
					tempRepoData,
					previousRepo,
					setSelectedRepo,
					showLoadingModal,
					copyRepoModalIsOpen,
					setCopyRepoModalIsOpen,
					repoList,
					setShowLoadingModal,
					headsUpModalIsOpen,
					setHeadsUpModalIsOpen,
					addResourceWarningModalIsOpen,
					setAddResourceWarningModalIsOpen,
					exitWarningModalIsOpen,
					setExitWarningModalIsOpen,
					backButton: props.backButton,
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
				<Grid container direction="row">
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
								<LabelledRadioSelect
									text="Provider"
									description={
										<div>
											<p>
												Select the provider you have a
												cloud services account with.
											</p>
											<p>
												<Link
													href="https://github.com/devxp-ca/devxp/wiki/Terraform#providers"
													target="_blank"
													rel="noopener">
													Learn more.
												</Link>
											</p>
										</div>
									}
									options={[
										{
											key: "aws",
											label: "Amazon",
											disabled:
												trackedResources.length > 0
										},
										{
											key: "google",
											label: "Google",
											disabled:
												trackedResources.length > 0
										},
										{
											key: "azure",
											label: "Azure",
											disabled: true
										}
									]}
									initial={selectedProvider}
									onChange={(value: string) => {
										setSelectedProvider(value);
										setSettingsHaveBeenEdited(true);
									}}
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
														select Manage all
														projects. The names and
														IDs for all the projects
														you're a member of are
														displayed.
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
										selectedProvider === "aws"
											? false
											: true
									}>
									<Tooltip title="Advanced Options">
										<SettingsIcon />
									</Tooltip>
								</IconButton>
							</Grid>
						</Grid>
					</FormControl>
				</Grid>
				<Grid item>
					<Button
						variant="outlined"
						color="primary"
						size="large"
						sx={{
							width: defaultCardSize / 3,
							height: defaultCardSize,
							borderWidth: 2
						}}
						onClick={() => {
							if (settingsHaveBeenEdited) {
								setExitWarningModalIsOpen(true);
							} else {
								props.backButton();
							}
						}}>
						<ArrowBackIcon />
					</Button>
				</Grid>
				<Grid item>
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
				</Grid>
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
			<Grid
				container
				columns={2}
				justifyContent="center"
				spacing={2}
				sx={{
					paddingTop: 3,
					position: "fixed",
					bottom: 25,
					width: isMobile === true ? "100%" : "calc(100vw - 76px)",
					pointerEvents: "none"
				}}>
				<Grid item>
					<Button
						disabled={
							//openCards > 0 ||
							!settingsHaveBeenEdited ||
							(selectedProvider?.length ?? 0) < 1 ||
							(selectedRepo?.length ?? 0) < 1 ||
							(selectedProvider === "google" &&
								project.length < 6)
						}
						variant="contained"
						color="success"
						size="large"
						startIcon={<CheckIcon />}
						aria-label="submit to repo"
						onClick={handleOpenSubmitModalConfirmation(
							setSubmitModalInfo,
							setSubmitModalIsOpen,
							selectedRepo
						)}
						sx={{
							width: "281px",
							padding: 2,
							fontSize: 18,
							pointerEvents: "initial",
							":hover": {
								bgcolor: "success.main",
								opacity: 0.9
							}
						}}>
						Create Pull Request
					</Button>
				</Grid>
				<Grid item>
					<Button
						disabled={!settingsHaveBeenEdited}
						variant="contained"
						color="error"
						size="large"
						startIcon={<DeleteIcon />}
						aria-label="discard changes"
						onClick={() => {
							setSettingsHaveBeenEdited(false);
							resetRepoData();
						}}
						sx={{
							width: "281px",
							padding: 2,
							fontSize: 18,
							pointerEvents: "initial"
						}}>
						Discard Changes
					</Button>
				</Grid>
			</Grid>
			{isMobile === false && (
				<PreviewWindow data={previewData} error={previewError} />
			)}
		</Box>
	);
}
