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
import {CardActionArea, LinearProgress} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import {lightTheme} from "../style/themes";
import axios, {AxiosError} from "axios";
import GenericModal from "./modals/GenericModal";
import {CONFIG} from "../config";
import CheckIcon from "@mui/icons-material/Check";
import Tooltip from "@mui/material/Tooltip";
import LabelledCheckboxInput from "./labelledInputs/LabelledCheckboxInput";
import LabelledRadioSelect from "./labelledInputs/LabelledRadioSelect";
import typeToResource from "./resources/typeToResource";
import Resource from "./resources/Resource";
import {
	handleCloseModal,
	handleOpenFailModal,
	handleOpenSubmitModalNoRepo,
	handleOpenSubmitModalConfirmation,
	handleOpenSuccessModal,
	handleAwaitSuccessModal
} from "./modals/modalHandlers";

import TerraformOptionsModal from "./modals/TerraformOptionsModal";

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

export default function TerraformManager(props: {
	selectedRepo: string;
	repoData: terraformDataSettings;
	backButton: () => void;
	setSettingsHaveBeenEdited: (hasEdited: boolean) => void;
}) {
	const currentTheme = lightTheme;
	const defaultCardSize = 250;

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

	React.useEffect(() => {
		setTrackedResources(props.repoData?.settings?.resources ?? []);
		setSelectedProvider(props.repoData?.settings?.provider ?? "");
		setSelectedSecureOption(props.repoData?.settings?.secure ?? false);
		setSelectedAllowSshOption(props.repoData?.settings?.allowSsh ?? true);
		setSelectedAllowEgressWebOption(
			props.repoData?.settings?.allowEgressWeb ?? true
		);
		setSelectedAllowIngressWebOption(
			props.repoData?.settings?.allowIngressWeb ?? false
		);
		setSelectedAutoLoadBalanceOption(
			props.repoData?.settings?.autoLoadBalance ?? false
		);
	}, [props.repoData]);

	type partialResource = resourceSettings | {type: string} | undefined;
	const [currentResource, setCurrentResource] =
		React.useState<partialResource>();

	const handleSubmit = () => {
		setSubmitModalIsOpen(true);
		handleAwaitSuccessModal(
			setSubmitModalInfo,
			setSubmitModalIsOpen,
			props.selectedRepo
		)();
		axios
			.post(
				`${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`,
				removeEmptyKeys({
					tool: "terraform",
					repo: props.selectedRepo,
					settings: {
						provider: selectedProvider,
						secure: selectedSecureOption,
						allowSsh: selectedAllowSshOption,
						allowIngressWeb: selectedAllowIngressWebOption,
						allowEgressWeb: selectedAllowEgressWebOption,
						autoLoadBalance: selectedAutoLoadBalanceOption,
						resources: trackedResources
					}
				})
			)
			.then(response => {
				console.log(response.data);
				handleOpenSuccessModal(
					setSubmitModalInfo,
					setSubmitModalIsOpen
				)();
				setDirty(false);
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
		title: "",
		body: "",
		loading: false
	});

	//OPTIONS MODAL THINGS
	const [openOptionsModal, setOpenOptionsModal] = React.useState(false);

	useEffect(() => {
		window.onbeforeunload = () => {
			if (dirty) {
				return "Are you sure you want to leave without submitting your configuration?";
			}
		};
	});

	//TODO: add more info to provider, can't switch it after submitting instances unless you want to delete them all -- override in options?
	//TODO: bug with provider and secure states where if you change it it doesn't register until you reload the page
	const [dirty, setDirty] = React.useState(false);

	return (
		<Box sx={{width: "100%", paddingBottom: 12}}>
			<TerraformOptionsModal
				isOpen={!!openOptionsModal}
				handleClose={() => {
					setCurrentResource(undefined);
					setOpenOptionsModal(false);
				}}
				handleClick={(event: any, value: string) => {
					setCurrentResource({
						type: value
					});
					setOpenOptionsModal(false);
				}}
				provider={selectedProvider}
				title={`Choose your Resource for ${selectedProvider}`}
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
											setDirty(true);
										},
										onDelete: () => {
											setCurrentResource(undefined);
											setDirty(true);
										},
										onChange: () => {
											props.setSettingsHaveBeenEdited(
												true
											);
											setDirty(true);
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
				children={
					<>
						{!submitModalInfo.loading && (
							<div
								style={{
									display: "flex",
									justifyContent: "center"
								}}>
								<Button
									color="secondary"
									variant="contained"
									size="large"
									sx={{marginTop: 2}}
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
							</div>
						)}
						{!!submitModalInfo.loading && (
							<div>
								<LinearProgress></LinearProgress>
							</div>
						)}
					</>
				}
			/>
			<Grid container direction="row" spacing={2}>
				<Grid container direction="row">
					<Typography sx={{paddingTop: 4}} variant="h4">
						Terraform
					</Typography>
					<FormControl>
						<Grid
							container
							direction="column"
							sx={{
								paddingLeft: 8,
								paddingTop: 4.5,
								marginBottom: 2
							}}>
							<LabelledRadioSelect
								text="Provider"
								description="Select the provider you have a cloud services account with"
								options={[
									{
										key: "aws",
										label: "Amazon",
										disabled: trackedResources.length > 0
									},
									{
										key: "google",
										label: "Google",
										disabled: trackedResources.length > 0
									},
									{
										key: "azure",
										label: "Azure",
										disabled: true
									}
								]}
								initial={props.repoData?.settings?.provider}
								onChange={(value: string) => {
									setSelectedProvider(value);
									props.setSettingsHaveBeenEdited(true);
								}}
							/>
							{selectedProvider === "aws" && (
								<LabelledCheckboxInput
									text="Secure"
									description="Whether or not to put all the configured resources into their own VPC, setup a subnet, and give them IAM permissions to access each other."
									initial={props.repoData?.settings?.secure}
									onChange={(val: boolean) => {
										setSelectedSecureOption(val);
										props.setSettingsHaveBeenEdited(true);
									}}
								/>
							)}
							{selectedProvider === "aws" &&
								selectedSecureOption && (
									<>
										<LabelledCheckboxInput
											text="Enable SSH"
											description="Opens up port 22 for ssh access."
											initial={
												props.repoData?.settings
													?.allowSsh
											}
											onChange={(val: boolean) => {
												setSelectedAllowSshOption(val);
												props.setSettingsHaveBeenEdited(
													true
												);
											}}
										/>
										<LabelledCheckboxInput
											text="Enable Inbound Web Traffic"
											description="Opens up ports 443 and 80 for web traffic."
											initial={
												props.repoData?.settings
													?.allowIngressWeb
											}
											onChange={(val: boolean) => {
												setSelectedAllowIngressWebOption(
													val
												);
												props.setSettingsHaveBeenEdited(
													true
												);
											}}
										/>
										<LabelledCheckboxInput
											text="Enable Outbound Web Traffic"
											description="Opens up ports 443 and 80 for software updates, web requests, etc."
											initial={
												props.repoData?.settings
													?.allowEgressWeb
											}
											onChange={(val: boolean) => {
												setSelectedAllowEgressWebOption(
													val
												);
												props.setSettingsHaveBeenEdited(
													true
												);
											}}
										/>
										<LabelledCheckboxInput
											text="Enable Network Load Balancing"
											description="Spins up a network load balancer within your VPC, connected to all ec2 instances."
											initial={
												props.repoData?.settings
													?.autoLoadBalance
											}
											onChange={(val: boolean) => {
												setSelectedAutoLoadBalanceOption(
													val
												);
												props.setSettingsHaveBeenEdited(
													true
												);
											}}
										/>
									</>
								)}
						</Grid>
					</FormControl>
				</Grid>
				<Grid item>
					<Button
						variant="outlined"
						sx={{width: 3, height: defaultCardSize}}
						onClick={props.backButton}>
						<ArrowBackIcon />
					</Button>
				</Grid>
				<Grid item>
					<Card>
						<Tooltip title="Add a new Terraform instance, must select provider first">
							<CardActionArea
								onClick={() => {
									//TODO: Popup modal and select type
									// If provider selected, open:
									if ((selectedProvider?.length ?? 0) > 0) {
										setOpenOptionsModal(true);
									} else {
										setOpenOptionsModal(false);
									}
									// Otherwise, should we have a popover reminder?
								}}
								sx={{
									"&:hover": {
										backgroundColor: `${currentTheme.palette.success.main}50`
									}
								}}>
								<Grid
									container
									justifyContent="center"
									alignItems="center"
									sx={{
										width: defaultCardSize / 2,
										height: defaultCardSize,
										border: `1px solid ${currentTheme.palette.success.main}`,
										borderRadius: 1
									}}>
									<Grid item>
										<AddIcon
											sx={{
												width: 75,
												height: 75,
												opacity: 1,
												color: currentTheme.palette
													.success.main
											}}
										/>
									</Grid>
								</Grid>
							</CardActionArea>
						</Tooltip>
					</Card>
				</Grid>
				{trackedResources.map((resource, index) => (
					<Grid item key={`prevInstanceCardGrid${index}`}>
						{(
							typeToResource(resource, true) as Resource<any, any>
						).toCard(
							() => {
								setCurrentResource(resource);
								setTrackedResources(
									trackedResources.filter(
										(r, i) => i !== index
									)
								);
							},
							defaultCardSize,
							currentTheme
						)}
					</Grid>
				))}
			</Grid>
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
						(selectedProvider?.length ?? 0) < 1 ||
						(props.selectedRepo?.length ?? 0) < 1
					}
					variant="contained"
					color="success"
					size="large"
					startIcon={<CheckIcon />}
					aria-label="submit to repo"
					onClick={handleOpenSubmitModalConfirmation(
						setSubmitModalInfo,
						setSubmitModalIsOpen,
						props.selectedRepo
					)}
					sx={{
						padding: 2,
						fontSize: 18,
						pointerEvents: "initial"
					}}>
					Submit To Repo
				</Button>
			</Box>
		</Box>
	);
}
