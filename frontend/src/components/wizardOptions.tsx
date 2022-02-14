import React from "react";
import Button from "@mui/material/Button";
import Accordion from "../components/Accordion";
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
import MouseOverPopover from "../components/MouseOverPopover";

import GenericModal from "./GenericModal";

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
		const data = {
			provider: providerValue,
			accessKey: accessKeyValue,
			secretKey: secretKeyValue
		};
		//call backend method with data
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
									/>
									<FormControlLabel
										key="other"
										value="other"
										control={<Radio size="small" />}
										label="Azure"
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
