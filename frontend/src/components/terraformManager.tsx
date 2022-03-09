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
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";

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
		//Remove any currently open instance since the provider has changed
		setSelectNewInstance(false);
		setSelectedProvider((event.target as HTMLInputElement).value);
	};

	const savedSecureOption = Boolean(props.repoData)
		? props.repoData.settings.secure
		: true;
	const [selectedSecureOption, setSelectedSecureOption] =
		React.useState(savedSecureOption);

	const savedAllowEgressWebOption = Boolean(props.repoData)
		? !!(props.repoData.settings as any).AllowEgressWeb
		: true;
	const [selectedAllowEgressWebOption, setSelectedAllowEgressWebOption] =
		React.useState(savedAllowEgressWebOption);

	const savedAllowSshOption = Boolean(props.repoData)
		? !!(props.repoData.settings as any).AllowSsh
		: true;
	const [selectedAllowSshOption, setSelectedAllowSshOption] =
		React.useState(savedAllowSshOption);

	const savedAllowIngressWebOption = Boolean(props.repoData)
		? !!(props.repoData.settings as any).allowIngressWeb
		: false;
	const [selectedAllowIngressWebOption, setSelectedAllowIngressWebOption] =
		React.useState(savedAllowIngressWebOption);

	const savedAutoLoadBalanceOption = Boolean(props.repoData)
		? !!(props.repoData.settings as any).autoLoadBalance
		: false;
	const [selectedAutoLoadBalanceOption, setSelectedAutoLoadBalanceOption] =
		React.useState(savedAutoLoadBalanceOption);

	const handleChangeSecureOption = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setSelectedSecureOption(event.target.checked);
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
					secure: updatedConfigurations.settings.secure,
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
					secure: prevSettings.settings.secure,
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
							<Tooltip title="Add a new Terraform instance, must select provider first">
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
							</Tooltip>
						)}
						{/* if provider is blank the + button will not work -- may need to communicate this more */}
						{selectedNewInstance && selectedProvider != "" && (
							<TerraformOptions
								selectedRepo={props.selectedRepo}
								globalProvider={selectedProvider}
								globalSecure={selectedSecureOption}
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
		updatedConfigurations.settings.secure = selectedSecureOption;
		(updatedConfigurations as any).settings.allowSsh =
			selectedAllowSshOption;
		(updatedConfigurations as any).settings.allowEgressWeb =
			selectedAllowEgressWebOption;
		(updatedConfigurations as any).settings.allowIngressWeb =
			selectedAllowIngressWebOption;
		(updatedConfigurations as any).settings.autoLoadBalance =
			selectedAutoLoadBalanceOption;

		axios
			.post(
				`${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`,
				removeEmptyKeys(updatedConfigurations)
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
	//TODO: bug with provider and secure states where if you change it it doesn't register until you reload the page
	return (
		<Box sx={{width: "100%", paddingBottom: 12}}>
			<GenericModal
				isOpen={openModal}
				handleClose={handleCloseModal}
				title={modalText.title}
				bodyText={modalText.body}
				children={modalChildren()}
			/>
			<Grid container direction="row">
				<Typography sx={{paddingTop: 4}} variant="h4">
					Terraform
				</Typography>
				<FormControl>
					<Grid
						container
						direction="column"
						sx={{paddingLeft: 8, paddingTop: 4.5, marginBottom: 2}}>
						<Grid container direction="row">
							<Typography sx={{paddingTop: 0.4}} variant="h6">
								Provider
							</Typography>
							<MouseOverPopover
								icon={
									<HelpIcon
										sx={{
											paddingLeft: 1,
											paddingTop: 0.85,
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
									disabled={true}
								/>
							</RadioGroup>
						</Grid>
						<Grid container direction="row">
							<Typography sx={{paddingTop: 0.4}} variant="h6">
								Secure
							</Typography>
							<MouseOverPopover
								icon={
									<HelpIcon
										sx={{
											paddingLeft: 1,
											paddingTop: 0.85,
											opacity: 0.5
										}}
									/>
								}
								popOverInfo={<div>Secures resources</div>}
							/>
							<Checkbox
								sx={{
									"& .MuiSvgIcon-root": {
										fontSize: 28
									},
									marginTop: -0.45
								}}
								onChange={handleChangeSecureOption}
								defaultChecked={selectedSecureOption}
								checked={selectedSecureOption}
							/>
						</Grid>
						{selectedSecureOption && (
							<>
								<Grid container direction="row">
									<Typography
										sx={{paddingTop: 0.4}}
										variant="h6">
										Enable SSH
									</Typography>
									<MouseOverPopover
										icon={
											<HelpIcon
												sx={{
													paddingLeft: 1,
													paddingTop: 0.85,
													opacity: 0.5
												}}
											/>
										}
										popOverInfo={
											<div>
												Opens up port 22 for ssh access
											</div>
										}
									/>
									<Checkbox
										sx={{
											"& .MuiSvgIcon-root": {
												fontSize: 28
											},
											marginTop: -0.45
										}}
										onChange={(
											event: React.ChangeEvent<HTMLInputElement>
										) =>
											setSelectedAllowSshOption(
												event.target.checked
											)
										}
										defaultChecked={selectedAllowSshOption}
										checked={selectedAllowSshOption}
									/>
								</Grid>
								<Grid container direction="row">
									<Typography
										sx={{paddingTop: 0.4}}
										variant="h6">
										Enable Inbound Web Traffic
									</Typography>
									<MouseOverPopover
										icon={
											<HelpIcon
												sx={{
													paddingLeft: 1,
													paddingTop: 0.85,
													opacity: 0.5
												}}
											/>
										}
										popOverInfo={
											<div>
												Opens up ports 443 and 80 for
												web traffic
											</div>
										}
									/>
									<Checkbox
										sx={{
											"& .MuiSvgIcon-root": {
												fontSize: 28
											},
											marginTop: -0.45
										}}
										onChange={(
											event: React.ChangeEvent<HTMLInputElement>
										) =>
											setSelectedAllowIngressWebOption(
												event.target.checked
											)
										}
										defaultChecked={
											selectedAllowIngressWebOption
										}
										checked={selectedAllowIngressWebOption}
									/>
								</Grid>
								<Grid container direction="row">
									<Typography
										sx={{paddingTop: 0.4}}
										variant="h6">
										Enable Outbound Web Traffic
									</Typography>
									<MouseOverPopover
										icon={
											<HelpIcon
												sx={{
													paddingLeft: 1,
													paddingTop: 0.85,
													opacity: 0.5
												}}
											/>
										}
										popOverInfo={
											<div>
												Opens up ports 443 and 80 for
												software updates, web requests,
												etc
											</div>
										}
									/>
									<Checkbox
										sx={{
											"& .MuiSvgIcon-root": {
												fontSize: 28
											},
											marginTop: -0.45
										}}
										onChange={(
											event: React.ChangeEvent<HTMLInputElement>
										) =>
											setSelectedAllowEgressWebOption(
												event.target.checked
											)
										}
										defaultChecked={
											selectedAllowEgressWebOption
										}
										checked={selectedAllowEgressWebOption}
									/>
								</Grid>
								<Grid container direction="row">
									<Typography
										sx={{paddingTop: 0.4}}
										variant="h6">
										Enable Network Load Balancing
									</Typography>
									<MouseOverPopover
										icon={
											<HelpIcon
												sx={{
													paddingLeft: 1,
													paddingTop: 0.85,
													opacity: 0.5
												}}
											/>
										}
										popOverInfo={
											<div>
												Spins up a network load balancer
												within your VPC, connected to
												all ec2 instances
											</div>
										}
									/>
									<Checkbox
										sx={{
											"& .MuiSvgIcon-root": {
												fontSize: 28
											},
											marginTop: -0.45
										}}
										onChange={(
											event: React.ChangeEvent<HTMLInputElement>
										) =>
											setSelectedAutoLoadBalanceOption(
												event.target.checked
											)
										}
										defaultChecked={
											selectedAutoLoadBalanceOption
										}
										checked={selectedAutoLoadBalanceOption}
									/>
								</Grid>
							</>
						)}
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
