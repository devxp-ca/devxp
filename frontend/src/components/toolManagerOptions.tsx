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
import Slider from "@mui/material/Slider";
import HelpIcon from "@mui/icons-material/Help";

import Accordion from "./Accordion";
import MouseOverPopover from "./MouseOverPopover";
import GenericModal from "./GenericModal";
import {CONFIG} from "../config";

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

export default function ToolManagerOptions(props: {selectedRepo: string}) {
	//OPTION STATES AND REDUCER
	const initialOptionState = {
		providerValue: "",
		resourceTypeValue: "",
		instanceNameValue: "",
		amiValue: "",
		instanceTypeValue: ""
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
		instanceTypeValue
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
		/* TODO: get settings from component state? */

		/*

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

		const settings = {
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
		//Send settings to backend
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
		<div>
			<GenericModal
				isOpen={openModal}
				handleClose={handleCloseModal}
				title={modalText.title}
				bodyText={modalText.body}
				children={modalChildren()}
			/>
			{/* <Accordion title="CI/CD" content="Settings go here" /> */}
			<Accordion
				title="Terraform"
				content={
					<Grid container direction="column">
						<Grid item sx={{padding: 2}}>
							<FormControl>
								<FormLabel>
									<Grid container direction="row">
										Provider
										<MouseOverPopover
											icon={
												<HelpIcon
													sx={{paddingLeft: 1}}
												/>
											}
											popOverInfo={
												<div>
													Select the provider you have
													a cloud services account
													with
												</div>
											}
										/>
									</Grid>
								</FormLabel>
								<RadioGroup
									name="Provider"
									value={providerValue}
									onChange={(
										event: React.ChangeEvent<HTMLInputElement>
									) =>
										dispatch({
											type: "provider",
											payload: (
												event.target as HTMLInputElement
											).value
										})
									}
									row>
									<FormControlLabel
										key="aws"
										value="aws"
										control={<Radio size="small" />}
										label="Amazon"
									/>
									<FormControlLabel
										key="google"
										value="google"
										control={<Radio size="small" />}
										label="Google"
										disabled={true}
									/>
									<FormControlLabel
										key="other"
										value="other"
										control={<Radio size="small" />}
										label="Azure"
										disabled={true}
									/>
								</RadioGroup>
							</FormControl>
						</Grid>
						{
							//AWS Options
							providerValue === "aws" && (
								<Grid container direction="column">
									<Grid container direction="row">
										<Grid item sx={{padding: 2}}>
											<FormControl>
												<FormLabel>
													<Grid
														container
														direction="row">
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
																	Choose the
																	type of
																	resource
																	that you
																	want
																	terraform to
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
													<MenuItem
														key="ec2"
														value="ec2">
														EC2
													</MenuItem>
												</Select>
											</FormControl>
										</Grid>
										<Grid item sx={{padding: 2}}>
											<FormControl>
												<FormLabel>
													<Grid
														container
														direction="row">
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
																	Give this
																	particular
																	instance a
																	name so it's
																	identifiable
																	-- can be
																	whatever you
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
													<Grid
														container
														direction="row">
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
																	Choose the
																	type of OS
																	you want
																	this
																	instance to
																	run
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
														value="ami-0341aeea105412b57">
														Amazon Linux 2 AMI (HVM)
													</MenuItem>
													<MenuItem
														key="ubuntu"
														value="ami-0892d3c7ee96c0bf7">
														Ubuntu Server 20.04 LTS
														64-bit x86
													</MenuItem>
													<MenuItem
														key="macOS"
														value="ami-0faefa03f7ddcd657">
														MacOS Monterey 12.2
													</MenuItem>
													<MenuItem
														key="windows"
														value="ami-0ab399fb9d53c302f">
														Microsoft Windows Server
														2019 Base with
														Containers
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
																	Choose the
																	computing
																	power you
																	want this
																	instance to
																	have:
																</p>
																<p>
																	Micro - 1
																	CPU 1gB RAM
																</p>
																<p>
																	Small - 1
																	CPU 2gB RAM
																</p>
																<p>
																	Medium - 2
																	CPU 4gB RAM
																</p>
																<p>
																	Large - 2
																	CPU 8gB RAM
																</p>
																<p>
																	Extra-Large
																	- 4 CPU 16gB
																	RAM
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
											</RadioGroup>
										</FormControl>
									</Grid>
								</Grid>
							)
						}
					</Grid>
				}
			/>
			<Box textAlign="center" sx={{padding: 3}}>
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
		</div>
	);
}
