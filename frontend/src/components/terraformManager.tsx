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

export default function TerraformManager(props: {
	selectedRepo: string;
	repoData: terraformDataSettings;
	backButton: () => void;
}) {
	const currentTheme = lightTheme;
	const defaultCardSize = 250;
	const [selectedNewInstance, setSelectNewInstance] = React.useState(false);
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

	const selectedNewInstanceCallback = () => {
		setSelectNewInstance(true);
	};

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
		const prevInstanceSettings = expandPreviousSettings(props.repoData);

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
						{selectedNewInstance && (
							<TerraformOptions
								selectedRepo={props.selectedRepo}
								globalProvider={selectedProvider}
							/>
						)}
					</Card>
				</Grid>
				{/* Populate previous instances here */}
				{prevInstanceSettings.map(cardSettings => (
					<Grid item>
						<TerraformInstanceCard
							cardData={cardSettings}
							cardSize={defaultCardSize}
							selectedRepo={props.selectedRepo}
						/>
					</Grid>
				))}
			</Grid>
		);
	};

	//TODO: add more info to provider, can't switch it after submitting instances unless you want to delete them all -- override in options?
	return (
		<Box sx={{width: "100%"}}>
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
		</Box>
	);
}
