import React from "react";
import axios from "axios";
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

import Accordion from "../components/Accordion";
import MouseOverPopover from "../components/MouseOverPopover";
import GenericModal from "./GenericModal";
import {CONFIG} from "../config";

export default function WizardOptions() {
	//TODO: find some way to condense this clunky data setting
	//OPTION STATES
	const [providerValue, setProviderValue] = React.useState("");
	const handleChangeProvider = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setProviderValue((event.target as HTMLInputElement).value);
	};

	const [accessKeyValue, setAccessKeyValue] = React.useState("");
	const handleChangeAccessKey = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setAccessKeyValue((event.target as HTMLInputElement).value);
	};

	const [secretKeyValue, setSecretKeyValue] = React.useState("");
	const handleChangeSecretKey = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setSecretKeyValue((event.target as HTMLInputElement).value);
	};

	//SUBMIT MODAL THINGS
	const [openSubmitModal, setOpenSubmitModal] = React.useState(false);
	const handleOpenSubmitModal = () => {
		setOpenSubmitModal(true);
	};
	const handleCloseSubmitModal = () => {
		setOpenSubmitModal(false);
	};
	const submitModalChildren = () => {
		return (
			<div style={{display: "flex", justifyContent: "center"}}>
				<Button
					color="secondary"
					variant="contained"
					size="large"
					sx={{marginTop: 2}}
					onClick={handleSubmit}>
					Confirm
				</Button>
			</div>
		);
	};

	const handleSubmit = () => {
		setOpenSubmitModal(false);
		/* TODO: get settings from component state? */
		const settings = {
			repo: "dexp-ca/devxp-test-repo",
			tool: "terraform",
			settings: {
				provider: "aws",
				resources: [
					{
						type: "ec2",
						id: "myEc2Instance",
						ami: "ami-0341aeea105412b57",
						instance_type: "t2.micro"
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
				/* TODO: Bring up success modal */
			})
			.catch(error => {
				/**TODO: Render an error component */
				console.log(error);
			});
	};

	return (
		<div>
			<GenericModal
				isOpen={openSubmitModal}
				handleClose={handleCloseSubmitModal}
				title={"Are you sure you want to submit?"}
				bodyText={
					"Once confirmed, we will push a pull request to a temporary branch on your repository for review"
				}
				children={submitModalChildren()}
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
											popOverInfo="Select the provider you have a cloud services account with"
										/>
									</Grid>
								</FormLabel>
								<RadioGroup
									name="Provider"
									value={providerValue}
									onChange={handleChangeProvider}
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
								<Grid container direction="row">
									<Grid item sx={{padding: 2}}>
										<FormControl>
											<FormLabel>
												<Grid container direction="row">
													Access Key
													<MouseOverPopover
														icon={
															<HelpIcon
																sx={{
																	paddingLeft: 1
																}}
															/>
														}
														popOverInfo="Description of where to find it"
													/>
												</Grid>
											</FormLabel>
											<TextField
												id="access-key"
												name="access-key"
												label=""
												type="text"
												value={accessKeyValue}
												onChange={handleChangeAccessKey}
											/>
										</FormControl>
									</Grid>
									<Grid item sx={{padding: 2}}>
										<FormControl>
											<FormLabel>
												<Grid container direction="row">
													Secret Key
													<MouseOverPopover
														icon={
															<HelpIcon
																sx={{
																	paddingLeft: 1
																}}
															/>
														}
														popOverInfo="Description of where to find it"
													/>
												</Grid>
											</FormLabel>
											<TextField
												id="secret-key"
												name="secret-key"
												label=""
												type="text"
												value={secretKeyValue}
												onChange={handleChangeSecretKey}
											/>
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
