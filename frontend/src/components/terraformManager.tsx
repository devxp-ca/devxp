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
import LinearProgress from "@mui/material/LinearProgress";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import axios, {AxiosError} from "axios";
import GenericModal from "./modals/GenericModal";
import {CONFIG} from "../config";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import LabelledRadioSelect from "./labelledInputs/LabelledRadioSelect";
import typeToResource from "./resources/typeToResource";
import Resource from "./resources/Resource";
import OkModal from "./modals/OkModal";
import OkCancelModal from "./modals/OkCancelModal";
import {
	handleCloseModal,
	handleOpenFailModal,
	handleOpenSubmitModalConfirmation,
	handleOpenSuccessModal,
	handleAwaitSuccessModal
} from "./modals/modalHandlers";

import TerraformOptionsModal from "./modals/TerraformOptionsModal";
import AdvancedOptionsModal from "./modals/AdvancedOptionsModal";
import LabelledTextInput from "./labelledInputs/LabelledTextInput";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import LoadingModal from "./modals/LoadingModal";
import Tooltip from "@mui/material/Tooltip";
import CopyRepoSettingsModal from "./modals/CopyRepoSettingsModal";
import PreviewWindow from "../components/livePreview/previewWindow";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

const removeEmptyKeys = (obj: Record<string, any>) => {
	Object.keys(obj).forEach(key => {
		if (typeof obj[key] === "object") {
			obj[key] = removeEmptyKeys(obj[key]);
		} else if (Array.isArray(obj[key])) {
			for (let i = 0; i < obj[key].length; i++) {
				obj[key][i] = removeEmptyKeys(obj[key][i]);
			}
		} else if (typeof obj[key] === "string" && obj[key].length === 0) {
			delete obj[key];
		}
	});
	return obj;
};

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

	type partialResource = resourceSettings | {type: string} | undefined;
	const [currentResource, setCurrentResource] =
		React.useState<partialResource>();
	const [nextResource, setNextResource] = React.useState<partialResource>();

	const handleSubmit = () => {
		setSubmitModalIsOpen(true);
		handleAwaitSuccessModal(
			setSubmitModalInfo,
			setSubmitModalIsOpen,
			selectedRepo
		)();
		axios
			.post(
				`${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`,
				removeEmptyKeys({
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
						project
					}
				})
			)
			.then(response => {
				handleOpenSuccessModal(
					setSubmitModalInfo,
					setSubmitModalIsOpen,
					response.data?.pr?.html_url ?? ""
				)();
				setSettingsHaveBeenEdited(false);
			})
			.catch((error: AxiosError) => {
				console.dir(error.response.data);
				handleOpenFailModal(
					setSubmitModalInfo,
					setSubmitModalIsOpen
				)(error.response?.data?.errors ?? []);
			});
	};

	//SUBMIT MODAL THINGS
	const [submitModalIsOpen, setSubmitModalIsOpen] = React.useState(false);
	const [submitModalInfo, setSubmitModalInfo] = React.useState({
		isSubmitModal: true,
		isSuccessModal: false,
		title: "",
		body: "",
		loading: false,
		width: ""
	});

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

	//Default or customize
	const [openDefaultsModal, setOpenDefaultsModal] = React.useState(false);

	return (
		<Box sx={{width: "100%", paddingBottom: 12}}>
			<GenericModal
				isOpen={!!openDefaultsModal}
				handleClose={() => {
					setOpenDefaultsModal(false);
				}}
				title="Customize or Quickstart"
				children={
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-evenly"
						}}>
						<Tooltip title="Populate the resource on your own">
							<Button
								sx={{
									":hover": {
										bgcolor: "primary.main",
										opacity: 0.9
									}
								}}
								size="large"
								variant="contained"
								onClick={() => {
									setCurrentResource(nextResource);
									setOpenDefaultsModal(false);
								}}>
								Customize
							</Button>
						</Tooltip>
						<Tooltip title="Populate the resource with default values">
							<Button
								sx={{
									":hover": {
										bgcolor: "primary.main",
										opacity: 0.9
									}
								}}
								size="large"
								variant="contained"
								onClick={() => {
									const resource = typeToResource(
										nextResource,
										true
									) as Resource<unknown, any>;
									resource.populateDefault();
									setTrackedResources([
										...trackedResources,
										resource.getData() as unknown as resourceSettings
									]);
									setOpenDefaultsModal(false);
								}}>
								Quickstart
							</Button>
						</Tooltip>
					</div>
				}
			/>
			<TerraformOptionsModal
				isOpen={!!openOptionsModal}
				handleClose={() => {
					setCurrentResource(undefined);
					setOpenOptionsModal(false);
				}}
				handleClick={(event: any, value: string) => {
					setOpenDefaultsModal(true);
					setOpenOptionsModal(false);
					setNextResource({
						type: value
					});
				}}
				provider={selectedProvider}
				title={`Choose ${
					/[aeiou]/i.test(selectedProvider[0]) ? "an" : "a"
				} ${
					selectedProvider === "aws"
						? "AWS"
						: selectedProvider.charAt(0).toUpperCase() +
						  selectedProvider.slice(1)
				} Resource`}
			/>
			<GenericModal
				isOpen={!!currentResource}
				handleClose={() => {
					if (
						currentResource &&
						Object.keys(currentResource).length > 1
					) {
						setTrackedResources([
							...trackedResources,
							currentResource as resourceSettings
						]);
					}
					setCurrentResource(undefined);
				}}
				title={`${
					currentResource && Object.keys(currentResource).length > 1
						? "Edit"
						: "Add New"
				} Resource`}
				children={
					currentResource && (
						<Grid container direction="column" alignItems="center">
							{
								typeToResource(
									{
										...currentResource,
										repo: selectedRepo ?? "",
										isModifying:
											Object.keys(currentResource)
												.length > 1,
										onSave: (
											data: resourceSettings & {
												resources: number;
											}
										) => {
											let newResources: resourceSettings[] =
												[];
											for (
												let i = 0;
												i < data.resources;
												i++
											) {
												newResources = [
													...newResources,
													data.resources > 1
														? {
																...data,
																id: `${
																	data.id
																}-${String.fromCharCode(
																	97 + i
																)}`
														  }
														: data
												];
											}

											setTrackedResources([
												...newResources,
												...trackedResources
											]);
											setCurrentResource(undefined);
											setSettingsHaveBeenEdited(true);
										},
										onDelete: () => {
											setCurrentResource(undefined);
											setSettingsHaveBeenEdited(true);
										},
										onChange: () => {
											setSettingsHaveBeenEdited(true);
										}
									},
									false
								) as React.ReactElement
							}
						</Grid>
					)
				}
				width="90vw"
			/>
			<GenericModal
				isOpen={submitModalIsOpen}
				handleClose={handleCloseModal(setSubmitModalIsOpen)}
				title={submitModalInfo.title}
				bodyText={submitModalInfo.body}
				width={submitModalInfo.width}
				isSuccess={submitModalInfo.isSuccessModal}
				children={
					<>
						{!submitModalInfo.loading && (
							<Stack
								style={{
									display: "flex",
									justifyContent: "center"
								}}>
								<Button
									color="secondary"
									variant="contained"
									size="large"
									sx={{
										marginTop: 2,
										":hover": {
											bgcolor: "secondary.main",
											opacity: 0.9
										}
									}}
									onClick={
										submitModalInfo.isSubmitModal
											? handleSubmit
											: handleCloseModal(
													setSubmitModalIsOpen
											  )
									}>
									{submitModalInfo.isSubmitModal
										? "Confirm"
										: "Ok"}
								</Button>
							</Stack>
						)}
						{!!submitModalInfo.loading && (
							<div>
								<LinearProgress></LinearProgress>
							</div>
						)}
						{}
					</>
				}
			/>
			<Grid
				container
				direction="row"
				justifyContent="space-between"
				columns={2}
				sx={{mt: 2}}>
				<Autocomplete
					sx={{width: "300px"}}
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
				<OkModal
					isOpen={overwriteWarningModalIsOpen}
					handleClose={handleCloseModal(
						setOverwriteWarningModalIsOpen
					)}
					title={"Heads up!"}
					bodyText={
						"It looks like you have uncommitted changes.\
									If you select a new repo, your uncommitted changes will be lost.\
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
					title={"Warning: This repo has saved settings."}
					bodyText={
						"Continuing will overwrite your currently unsaved settings."
					}
				/>
				<LoadingModal
					isOpen={showLoadingModal}
					loadingTitle={"Loading..."}
				/>
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
					handleClose={handleCloseModal(setHeadsUpModalIsOpen)}
					title={"Heads Up!"}
					bodyText={
						"It looks like you have unsubmitted changes. Unsubmitted changes will not be copied to other repos."
					}
				/>
			</Grid>
			<Grid
				item
				container
				direction="row"
				spacing={2}
				sx={{
					paddingTop: 2,
					marginLeft: 0,
					width: "100%",
					paddingRight: 2
				}}>
				<Grid container direction="row">
					<Typography sx={{paddingTop: 4}} variant="h4">
						Terraform
					</Typography>
					<FormControl>
						<Grid
							container
							direction="row"
							sx={{
								paddingLeft: 8,
								paddingTop: 4.5,
								marginBottom: 2
							}}>
							<Grid item>
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
							<Grid item>
								{/**Disable advanced options if provider isn't AWS
								 */}
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
								<AdvancedOptionsModal
									isOpen={advancedOptionsModalIsOpen}
									handleClose={() => {
										setAdvancedOptionsModalIsOpen(false);
									}}
									title="Advanced Options"
									handleClick={(
										event: any,
										value: string
									) => {
										setAdvancedOptionsModalIsOpen(false);
									}}
									selectedProvider={selectedProvider}
									selectedSecureOption={selectedSecureOption}
									setSelectedSecureOption={
										setSelectedSecureOption
									}
									settingsHaveBeenEdited={
										settingsHaveBeenEdited
									}
									setSettingsHaveBeenEdited={
										setSettingsHaveBeenEdited
									}
									selectedAllowSshOption={
										selectedAllowSshOption
									}
									setSelectedAllowSshOption={
										setSelectedAllowSshOption
									}
									selectedAllowIngressWebOption={
										selectedAllowIngressWebOption
									}
									setSelectedAllowIngressWebOption={
										setSelectedAllowIngressWebOption
									}
									selectedAllowEgressWebOption={
										selectedAllowEgressWebOption
									}
									setSelectedAllowEgressWebOption={
										setSelectedAllowEgressWebOption
									}
									selectedAutoLoadBalanceOption={
										selectedAutoLoadBalanceOption
									}
									setSelectedAutoLoadBalanceOption={
										setSelectedAutoLoadBalanceOption
									}
								/>
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
					<OkCancelModal
						isOpen={exitWarningModalIsOpen}
						onOk={() => {
							props.backButton();
							setExitWarningModalIsOpen(false);
							setSettingsHaveBeenEdited(false);
						}}
						onCancel={() => {
							setExitWarningModalIsOpen(false);
						}}
						title={"Hold Up!"}
						bodyText={
							"If you leave, you will lose your currently unsaved settings."
						}
					/>
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
						<OkModal
							isOpen={addResourceWarningModalIsOpen}
							handleClose={handleCloseModal(
								setAddResourceWarningModalIsOpen
							)}
							title={"Howdy,"}
							bodyText={
								"You'll need to select a provider before we can add resources for you."
							}
						/>
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
			<Grid>
				<Box
					textAlign="center"
					sx={{
						paddingTop: 3,
						position: "fixed",
						bottom: 75,
						width: "calc(100vw - 76px)",
						pointerEvents: "none"
					}}>
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
							padding: 2,
							fontSize: 18,
							pointerEvents: "initial",
							marginRight: 2,
							":hover": {
								bgcolor: "success.main",
								opacity: 0.9
							}
						}}>
						Create Pull Request
					</Button>
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
							padding: 2,
							fontSize: 18,
							pointerEvents: "initial"
						}}>
						Discard Changes
					</Button>
				</Box>
			</Grid>
			<PreviewWindow data={previewData} error={previewError} />
		</Box>
	);
}
