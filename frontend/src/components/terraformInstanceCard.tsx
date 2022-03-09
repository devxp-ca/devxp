import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {CardActionArea} from "@mui/material";
import TerraformOptions from "../components/terraformOptions";
import {terraformDataSettings} from "../components/terraformOptions";
import {Box} from "@mui/system";
import {lightTheme} from "../style/themes";
import BuildIcon from "@mui/icons-material/Build";

export default function TerraformInstanceCard(props: {
	selectedRepo: string;
	cardData: terraformDataSettings;
	cardSize: number;
	addNewDataCallback: (
		newData: terraformDataSettings,
		isModifyingInstance: Boolean,
		cardNum: number
	) => void;
	cardIndex: number;
}) {
	const currentTheme = lightTheme;
	const [selectedEditInstance, setSelectEditInstance] = React.useState(false);

	const selectedEditInstanceCallback = () => {
		setSelectEditInstance(true);
	};

	const passNewDataCallback = (
		data: terraformDataSettings,
		isModifying: Boolean,
		cardNum: number
	) => {
		setSelectEditInstance(false);
		props.addNewDataCallback(data, isModifying, cardNum);
	};

	/* TODO: Improve style/text, multiple cards open at same time? Maybe we should restrict */
	return (
		<Card
			sx={
				selectedEditInstance
					? {minWidth: props.cardSize}
					: {width: props.cardSize, height: props.cardSize}
			}>
			{!selectedEditInstance && (
				<CardActionArea
					onClick={selectedEditInstanceCallback}
					sx={{
						height: "100%",
						"&:hover": {
							backgroundColor: `${currentTheme.palette.primary.main}50`
						}
					}}>
					<CardMedia sx={{height: "100%"}}>
						<Typography
							gutterBottom
							variant="h5"
							component="div"
							sx={{
								backgroundColor: `${currentTheme.palette.primary.main}75`,
								borderRadius: 1,
								padding: 2,
								textAlign: "center",
								boxSizing: "border-box"
							}}>
							{props.cardData.settings.resources[0].id}
						</Typography>

						{/* TODO: Add display values for dynamoDB + lambda */}
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{padding: 2, paddingTop: 0}}>
							<p>Provider: {props.cardData.settings.provider}</p>
							<p>
								Secure:{" "}
								{props.cardData.settings.secure ? "on" : "off"}
							</p>

							{props.cardData.settings.provider === "aws" && (
								<p>
									<p>
										Resource:{" "}
										{
											props.cardData.settings.resources[0]
												.type
										}
									</p>
									<p>
										AutoIam:{" "}
										{props.cardData.settings.resources[0]
											.autoIam
											? "on"
											: "off"}
									</p>
									{props.cardData.settings.resources[0]
										.type === "ec2" && (
										<p>
											<p>
												OS:{" "}
												{
													props.cardData.settings
														.resources[0].ami
												}
											</p>
											<p>
												Hardware:
												{
													props.cardData.settings
														.resources[0]
														.instance_type
												}
											</p>
										</p>
									)}
								</p>
							)}
						</Typography>
					</CardMedia>
				</CardActionArea>
			)}

			{selectedEditInstance && (
				<TerraformOptions
					selectedRepo={props.selectedRepo}
					instanceDataForModify={props.cardData}
					globalProvider={props.cardData.settings.provider}
					globalSecure={props.cardData.settings.secure}
					addNewDataCallback={passNewDataCallback}
					cardIndex={props.cardIndex}
				/>
			)}
		</Card>
	);
}
