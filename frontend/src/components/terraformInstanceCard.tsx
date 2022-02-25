import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {CardActionArea} from "@mui/material";
import TerraformOptions from "../components/terraformOptions";
import {terraformDataSettings} from "../components/terraformOptions";

export default function TerraformInstanceCard(props: {
	selectedRepo: string;
	cardData: terraformDataSettings;
	cardSize: number;
}) {
	const [selectedEditInstance, setSelectEditInstance] = React.useState(false);
	const [cardExpandedStyle, setCardExpandedStyle] = React.useState(false);

	const selectedEditInstanceCallback = () => {
		setSelectEditInstance(true);
		setCardExpandedStyle(true);
	};

	/* TODO: Improve style/text, multiple cards open at same time? Maybe we should restrict */
	return (
		<Card
			sx={
				cardExpandedStyle
					? {minWidth: props.cardSize}
					: {width: props.cardSize, height: props.cardSize}
			}>
			<CardActionArea onClick={selectedEditInstanceCallback}>
				{!selectedEditInstance && (
					<CardContent>
						<Typography gutterBottom variant="h5" component="div">
							{props.cardData.settings.resources[0].id}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							<p>Provider: {props.cardData.settings.provider}</p>
							<p>
								Resource:{" "}
								{props.cardData.settings.resources[0].type}
							</p>
							<p>
								OS: {props.cardData.settings.resources[0].ami}
							</p>
							<p>
								Hardware:{" "}
								{
									props.cardData.settings.resources[0]
										.instance_type
								}
							</p>
						</Typography>
					</CardContent>
				)}
			</CardActionArea>
			{selectedEditInstance && (
				<TerraformOptions
					selectedRepo={props.selectedRepo}
					instanceDataForModify={props.cardData}
				/>
			)}
		</Card>
	);
}
