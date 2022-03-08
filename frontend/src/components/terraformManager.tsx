import React from "react";
import Button from "@mui/material/Button";
import {Box} from "@mui/system";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TerraformOptions, {
	terraformDataSettings
} from "../components/terraformOptions";
import TerraformInstanceCard from "../components/terraformInstanceCard";
import Card from "@mui/material/Card";
import {CardActionArea} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import MouseOverPopover from "./MouseOverPopover";
import FormControlLabel from "@mui/material/FormControlLabel";
import HelpIcon from "@mui/icons-material/Help";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import {lightTheme} from "../style/themes";
import axios, {AxiosError} from "axios";
import GenericModal from "./GenericModal";
import {CONFIG} from "../config";
import CheckIcon from "@mui/icons-material/Check";

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
	isRepoSelected: boolean;
	repoData: terraformDataSettings;
	backButton: () => void;
}) {
	const currentTheme = lightTheme;
	const defaultCardSize = 250;

	const savedProvider = Boolean(props.repoData)
		? props.repoData.settings.provider
		: "";
	const [selectedProvider, setSelectedProvider] =
		React.useState<string>(savedProvider);

	const handleChangeProvider = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setSelectedProvider((event.target as HTMLInputElement).value);
	};

	//for the + button
	const [selectedNewInstance, setSelectNewInstance] = React.useState(false);
	const selectedNewInstanceCallback = () => {
		if (selectedProvider == "") {
			setSelectNewInstance(false);
		} else {
			setSelectNewInstance(true);
		}
	};

	const [currentlySavedConfigurations, setCurrentlySavedConfigurations] =
		React.useState<terraformDataSettings>(props.repoData);
	const [updatedConfigurations, setUpdatedConfigurations] =
		React.useState<terraformDataSettings>(props.repoData);
	//TODO: does not check for properly filled settings -- may want this in the future?
	const changeConfigurationsCallback = (
		newInstanceOrSettings: terraformDataSettings,
		isModifyingInstance: Boolean,
		cardNum: number
	) => {
		if (Boolean(updatedConfigurations)) {
			//if newInstanceOrSetting is null it's deleting an instance
			// TODO: needs to delete from DB? unless submitting new settings already does that
			let justResources =
				newInstanceOrSettings !== null
					? newInstanceOrSettings.settings.resources
					: [];

			if (!isModifyingInstance) {
				//add new instance via concat resources to front of array
				justResources = justResources.concat(
					updatedConfigurations.settings.resources
				);
			} else {
				//if modifying -- search + replace old setting, places most recently edited at front (best fit for duplicating already existing instances?)
				updatedConfigurations.settings.resources.forEach(
					(element, index) => {
						if (index != cardNum) {
							justResources.push(element);
						}
					}
				);
			}

			const tempData: terraformDataSettings = {
				repo: updatedConfigurations.repo,
				tool: updatedConfigurations.tool,
				settings: {
					provider: updatedConfigurations.settings.provider,
					resources: justResources
				}
			};
			setUpdatedConfigurations(tempData);
		} else {
			//no previous configs so add the whole thing
			setUpdatedConfigurations(newInstanceOrSettings);
		}
		setSelectNewInstance(false);
	};

	//expands a single resource into a full terraformDataSettings with one resource slot
	const expandPreviousSettings = (
		prevSettings: terraformDataSettings
	): terraformDataSettings[] => {
		if (!Boolean(prevSettings)) {
			return [];
		}
		const collect: terraformDataSettings[] = [];

		prevSettings.settings.resources.forEach(element => {
			collect.push({
				repo: prevSettings.repo,
				tool: prevSettings.tool,
				settings: {
					provider: prevSettings.settings.provider,
					resources: [element]
				}
			});
		});

		return collect;
	};

	const getCards = () => {
		//array of terraformDataSettings with only one resource per index, used for tile generation
		//expanding these to keep consistenty with the terraformDataSettings interface (instead of chopping it up)
		const prevInstanceSettings = expandPreviousSettings(
			updatedConfigurations
		);

		return (
			<Grid container spacing={4}>
				<Grid item>
					<Button
						variant="outlined"
						sx={{width: 3, height: defaultCardSize}}
						onClick={props.backButton}>
						<ArrowBackIcon />
					</Button>
				</Grid>
				{/* New Terraform Instance */}
				<Grid item>
					<Card>
						{!selectedNewInstance && (
							<CardActionArea
								onClick={selectedNewInstanceCallback}
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
						)}
						{/* TODO: bug: changing provider when option box is already opened doesn't refresh options*/}
						{/* if provider is blank the + button will not work -- may need to communicate this more */}
						{selectedNewInstance && selectedProvider != "" && (
							<TerraformOptions
								selectedRepo={props.selectedRepo}
								globalProvider={selectedProvider}
								addNewDataCallback={
									changeConfigurationsCallback
								}
								cardIndex={0}
							/>
						)}
					</Card>
				</Grid>
				{/* Populate previous instances here */}
				{prevInstanceSettings.map((cardSettings, index) => (
					<Grid item>
						<TerraformInstanceCard
							cardData={cardSettings}
							cardSize={defaultCardSize}
							selectedRepo={props.selectedRepo}
							addNewDataCallback={changeConfigurationsCallback}
							cardIndex={index}
						/>
					</Grid>
				))}
			</Grid>
		);
	};

	const handleSubmit = () => {
		setOpenModal(false);

		//Dirty fix
		updatedConfigurations.tool = updatedConfigurations.tool ?? "terraform";
		updatedConfigurations.repo = props.selectedRepo;

		axios
			.post(
				`${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`,
				updatedConfigurations
			)
			.then(response => {
				console.log(response.data);
				//Was having concurrency issues(?) with this, may need something extra if not working
				setCurrentlySavedConfigurations(updatedConfigurations);
				handleOpenSuccessModal();
			})
			.catch((error: AxiosError) => {
				console.dir(error.response.data);
				handleOpenFailModal(error.response?.data?.errors ?? []);
			});
	};

	//SUBMIT MODAL THINGS
	const [openModal, setOpenModal] = React.useState(false);
	const [modalText, setModalText] = React.useState({
		isSubmitModal: true,
		title: "",
		body: ""
	});
	const [openAlertDialog, setOpenAlertDialog] = React.useState(false);
	const handleOpenSubmitModal = () => {
		//check to see if isRepoSelected is true, if not, prompt user to select a repo
		if (props.isRepoSelected) {
			setModalText({
				isSubmitModal: true,
				title: "Are you sure you want to submit?",
				body: "Once confirmed, we will push a pull request to a temporary branch on your repository for review"
			});
			setOpenModal(true);
		} else {
			setModalText({
				isSubmitModal: false,
				title: "Please select a repository",
				body: "You must select a repository before submitting"
			});
			setOpenModal(true);
		}
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

	//TODO: add more info to provider, can't switch it after submitting instances unless you want to delete them all -- override in options?
	return (
		<Box sx={{width: "100%", paddingBottom: 12}}>
			<GenericModal
				isOpen={openModal}
				handleClose={handleCloseModal}
				title={modalText.title}
				bodyText={modalText.body}
				children={modalChildren()}
			/>
			<Grid container direction="row" alignItems={"center"}>
				<Typography sx={{paddingTop: 4, marginBottom: 3}} variant="h4">
					Terraform
				</Typography>
				<FormControl>
					<Grid
						container
						direction="row"
						sx={{paddingLeft: 8, paddingTop: 1}}>
						<Typography sx={{paddingTop: 0.4}} variant="h6">
							Provider
						</Typography>
						<MouseOverPopover
							icon={
								<HelpIcon
									sx={{
										paddingLeft: 1,
										paddingTop: 1,
										opacity: 0.5
									}}
								/>
							}
							popOverInfo={
								<div>
									Select the provider you have a cloud
									services account with
								</div>
							}
						/>
						<RadioGroup
							name="Provider"
							value={selectedProvider}
							onChange={handleChangeProvider}
							row
							sx={{paddingLeft: 2}}>
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
					</Grid>
				</FormControl>
			</Grid>
			{getCards()}
			<Box
				textAlign="center"
				sx={{
					paddingTop: 3,
					position: "fixed",
					bottom: 75,
					left: "50%",
					transform: "translate(-50%)"
				}}>
				<Button
					variant="contained"
					color="success"
					size="large"
					startIcon={<CheckIcon />}
					aria-label="submit to repo"
					onClick={handleOpenSubmitModal}
					sx={{padding: 2, fontSize: 18}}>
					Submit To Repo
				</Button>
			</Box>
		</Box>
	);
}
