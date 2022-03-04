import React from "react";
import axios, {AxiosError} from "axios";
import Button from "@mui/material/Button";
import {Box} from "@mui/system";
import CheckIcon from "@mui/icons-material/Check";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import HelpIcon from "@mui/icons-material/Help";

import MouseOverPopover from "./MouseOverPopover";
import GenericModal from "./GenericModal";
import {CONFIG} from "../config";
import Typography from "@mui/material/Typography";

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

export interface terraformDataSettings {
	repo: string;
	tool: string;
	settings: {
		provider: string;
		resources: {
			type: string;
			id: string;
			ami: string;
			instance_type: string;
		}[];
	};
}

export default function TerraformOptions(props: {
	selectedRepo: string;
	instanceDataForModify?: terraformDataSettings; //used when modifying existing instances
	globalProvider: string;
}) {
	const isModifyingInstance = Boolean(props.instanceDataForModify);

	//OPTION STATES AND REDUCER -- pre-populate options if modifying
	//TODO: will have to change these to not rely on [0] array, may need to be passed as pieces of terraformDataSettings for each card
	const initialOptionState = {
		providerValue: isModifyingInstance
			? props.instanceDataForModify.settings.provider ??
			  props.globalProvider
			: props.globalProvider,
		resourceTypeValue: isModifyingInstance
			? props.instanceDataForModify.settings.resources[0].type ?? ""
			: "",
		instanceNameValue: isModifyingInstance
			? props.instanceDataForModify.settings.resources[0].id ?? ""
			: "",
		amiValue: isModifyingInstance
			? props.instanceDataForModify.settings.resources[0].ami ?? ""
			: "",
		instanceTypeValue: isModifyingInstance
			? props.instanceDataForModify.settings.resources[0].instance_type ??
			  ""
			: "",
		numberOfInstancesValue: 1
	};

	const [optionState, dispatch] = React.useReducer(
		optionsReducer,
		initialOptionState
	);

	const {
		providerValue,
		resourceTypeValue,
		instanceNameValue,
		amiValue,
		instanceTypeValue,
		numberOfInstancesValue
	} = optionState;

	function optionsReducer(state: any, action: any) {
		switch (action.type) {
			case "provider":
				return {
					...state,
					providerValue: action.payload
				};
			case "resourceType":
				return {
					...state,
					resourceTypeValue: action.payload
				};
			case "instanceName":
				return {
					...state,
					instanceNameValue: action.payload
				};
			case "ami":
				return {
					...state,
					amiValue: action.payload
				};
			case "instanceType":
				return {
					...state,
					instanceTypeValue: action.payload
				};
			case "numberOfInstances":
				return {
					...state,
					numberOfInstancesValue: action.payload
				};
			default:
				return state;
		}
	}

	//SUBMIT MODAL THINGS
	const [openModal, setOpenModal] = React.useState(false);
	const [modalText, setModalText] = React.useState({
		isSubmitModal: true,
		title: "",
		body: ""
	});
	const handleOpenSubmitModal = () => {
		setModalText({
			isSubmitModal: true,
			title: "Are you sure you want to submit?",
			body: "Once confirmed, we will push a pull request to a temporary branch on your repository for review"
		});
		setOpenModal(true);
	};
	const handleOpenSuccessModal = () => {
		setModalText({
			isSubmitModal: false,
			title: "Success",
			body: "Your changes have been successfully pushed to your repository"
		});
		setOpenModal(true);
	};
	const handleOpenFailModal = (errors: BackendError[]) => {
		setModalText({
			isSubmitModal: false,
			title: "Submission Failed",
			body:
				errors[0]?.message ??
				"Something went wrong, please make sure all the fields are filled out and try again"
		});
		setOpenModal(true);
	};
	const handleCloseModal = () => {
		setOpenModal(false);
	};
	const modalChildren = () => {
		return (
			<div style={{display: "flex", justifyContent: "center"}}>
				<Button
					color="secondary"
					variant="contained"
					size="large"
					sx={{marginTop: 2}}
					onClick={
						modalText.isSubmitModal
							? handleSubmit
							: handleCloseModal
					}>
					{modalText.isSubmitModal ? "Confirm" : "Ok"}
				</Button>
			</div>
		);
	};

	const handleSubmit = () => {
		setOpenModal(false);
		/* TODO add/figure out terraformDataSettings variables that account for all providers/servies, some will be optional etc.

			GOOGLE VERSION

			const settings = {
				repo: "devxp-ca/devxp-test-repo",
				tool: "terraform",
				settings: {
					provider: "google",
					project: "devxp-test-project",		//This field is required for Google, not AWS
					resources: [{
						type: "gce",
						id: "my-gce-instance",			//Note with google capital letters are not allowed
						disk_image: "ubuntu-2004-focal-v20220204",
						machine_type: "f1-micro"
					}]
				}
			}

		*/

		/* TODO: Implement modify an instance, pass bool+instance name to backend? Will have to avoid duplicate instance names */
		/* TODO: Implement number of instances, pass number to backend or pass bigger data from frontend? */
		const settings: terraformDataSettings = {
			repo: props.selectedRepo,
			tool: "terraform",
			settings: {
				provider: providerValue,
				resources: [
					{
						type: resourceTypeValue,
						id: instanceNameValue,
						ami: amiValue,
						instance_type: instanceTypeValue
					}
				]
			}
		};

		//Sends settings to backend
		axios
			.post(
				`https://${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`,
				settings
			)
			.then(response => {
				console.log(response.data);
				handleOpenSuccessModal();
			})
			.catch((error: AxiosError) => {
				console.dir(error.response.data);
				handleOpenFailModal(error.response?.data?.errors ?? []);
			});
	};

	return (
		<Box sx={{padding: 4}}>
			<GenericModal
				isOpen={openModal}
				handleClose={handleCloseModal}
				title={modalText.title}
				bodyText={modalText.body}
				children={modalChildren()}
			/>
			<Grid container direction="column">
				{
					//AWS Options
					providerValue === "aws" && (
						<Grid container direction="column">
							<Grid container direction="row">
								<Grid item sx={{padding: 2}}>
									<FormControl>
										<FormLabel>
											<Grid container direction="row">
												Resource Type
												<MouseOverPopover
													icon={
														<HelpIcon
															sx={{
																paddingLeft: 1
															}}
														/>
													}
													popOverInfo={
														<div>
															Choose the type of
															resource that you
															want terraform to
															spin up
														</div>
													}
												/>
											</Grid>
										</FormLabel>
										{/*TO DO: Move options shared between providers outside amazon only and make their values change depending on provider instead?*/}
										<Select
											name="resource-type"
											value={resourceTypeValue}
											onChange={(
												event: React.ChangeEvent<HTMLInputElement>
											) =>
												dispatch({
													type: "resourceType",
													payload: (
														event.target as HTMLInputElement
													).value
												})
											}>
											<MenuItem key="ec2" value="ec2">
												EC2
											</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								<Grid item sx={{padding: 2}}>
									<FormControl>
										<FormLabel>
											<Grid container direction="row">
												Instance Name
												<MouseOverPopover
													icon={
														<HelpIcon
															sx={{
																paddingLeft: 1
															}}
														/>
													}
													popOverInfo={
														<div>
															Give this particular
															instance a name so
															it's identifiable --
															can be whatever you
															like
														</div>
													}
												/>
											</Grid>
										</FormLabel>
										<TextField
											id="instance-name"
											name="instance-name"
											label=""
											type="text"
											value={instanceNameValue}
											onChange={(
												event: React.ChangeEvent<HTMLInputElement>
											) =>
												dispatch({
													type: "instanceName",
													payload: (
														event.target as HTMLInputElement
													).value
												})
											}
										/>
									</FormControl>
								</Grid>
								<Grid item sx={{padding: 2}}>
									<FormControl>
										<FormLabel>
											<Grid container direction="row">
												Instance OS
												<MouseOverPopover
													icon={
														<HelpIcon
															sx={{
																paddingLeft: 1
															}}
														/>
													}
													popOverInfo={
														<div>
															Choose the type of
															OS you want this
															instance to run
														</div>
													}
												/>
											</Grid>
										</FormLabel>
										{/*TO DO: Move options shared between providers outside amazon only and make their values change depending on provider instead?*/}
										<Select
											name="instance-os"
											value={amiValue}
											onChange={(
												event: React.ChangeEvent<HTMLInputElement>
											) =>
												dispatch({
													type: "ami",
													payload: (
														event.target as HTMLInputElement
													).value
												})
											}>
											<MenuItem
												key="amazon-linux"
												value="AUTO_AMAZON">
												Amazon Linux 2 AMI (HVM)
											</MenuItem>
											<MenuItem
												key="ubuntu"
												value="AUTO_UBUNTU">
												Ubuntu Server 20.04 LTS 64-bit
												x86
											</MenuItem>
											<MenuItem
												key="macOS"
												value="ami-0faefa03f7ddcd657">
												MacOS Monterey 12.2
											</MenuItem>
											<MenuItem
												key="windows"
												value="AUTO_WINDOWS">
												Microsoft Windows Server 2022
												Base with Containers
											</MenuItem>
										</Select>
									</FormControl>
								</Grid>
							</Grid>
							<Grid item sx={{padding: 2}}>
								<FormControl>
									<FormLabel>
										<Grid container direction="row">
											Instance Hardware
											<MouseOverPopover
												icon={
													<HelpIcon
														sx={{
															paddingLeft: 1
														}}
													/>
												}
												popOverInfo={
													<div>
														<p>
															Choose the computing
															power you want this
															instance to have:
														</p>
														<p>
															Micro - 1 CPU 1GB
															RAM
														</p>
														<p>
															Small - 1 CPU 2GB
															RAM
														</p>
														<p>
															Medium - 2 CPU 4GB
															RAM
														</p>
														<p>
															Large - 2 CPU 8GB
															RAM
														</p>
														<p>
															Extra-Large - 4 CPU
															16GB RAM
														</p>
													</div>
												}
											/>
										</Grid>
									</FormLabel>
									<RadioGroup
										name="Instance Hardware"
										value={instanceTypeValue}
										onChange={(
											event: React.ChangeEvent<HTMLInputElement>
										) =>
											dispatch({
												type: "instanceType",
												payload: (
													event.target as HTMLInputElement
												).value
											})
										}
										row>
										{optionState.am ===
										"ami-0faefa03f7ddcd657" ? (
											//If the ami image selected is MAC, the instance MUST be mac1.metal
											<>
												<FormControlLabel
													key="1"
													value="mac1.metal"
													control={
														<Radio size="small" />
													}
													label="Mac Hardware"
												/>
											</>
										) : (
											<>
												<FormControlLabel
													key="1"
													value="t2.micro"
													control={
														<Radio size="small" />
													}
													label="Micro"
												/>
												<FormControlLabel
													key="2"
													value="t2.small"
													control={
														<Radio size="small" />
													}
													label="Small"
												/>
												<FormControlLabel
													key="3"
													value="t2.medium"
													control={
														<Radio size="small" />
													}
													label="Medium"
												/>
												<FormControlLabel
													key="4"
													value="t2.large"
													control={
														<Radio size="small" />
													}
													label="Large"
												/>
												<FormControlLabel
													key="5"
													value="t2.xlarge"
													control={
														<Radio size="small" />
													}
													label="Extra-Large"
												/>
											</>
										)}
									</RadioGroup>
								</FormControl>
							</Grid>
						</Grid>
					)
				}
				<FormControl>
					<Grid
						container
						direction="row"
						alignItems="center"
						sx={{paddingTop: 2}}
						justifyContent="center">
						<Grid item>
							<FormLabel>
								<Grid container direction="row">
									Number of Instances
									<MouseOverPopover
										icon={
											<HelpIcon
												sx={{
													paddingLeft: 1,
													paddingRight: 1
												}}
											/>
										}
										popOverInfo={
											<div>
												Allows you to spin up any number
												of instances with the same
												settings chosen above
											</div>
										}
									/>
								</Grid>
							</FormLabel>
						</Grid>
						<Grid item>
							<TextField
								id="number-of-instances"
								name="number-of-instances"
								label=""
								type="number"
								value={numberOfInstancesValue}
								onChange={(
									event: React.ChangeEvent<HTMLInputElement>
								) =>
									dispatch({
										type: "numberOfInstances",
										payload: (
											event.target as HTMLInputElement
										).value
									})
								}
							/>
						</Grid>
					</Grid>
				</FormControl>
			</Grid>
			<Box textAlign="center" sx={{paddingTop: 3}}>
				<Button
					variant="contained"
					color="success"
					size="large"
					startIcon={<CheckIcon />}
					aria-label="submit to repo"
					onClick={handleOpenSubmitModal}>
					Submit
				</Button>
			</Box>
		</Box>
	);
}
