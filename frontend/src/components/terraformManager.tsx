import React from "react";
import Button from "@mui/material/Button";
import {Box} from "@mui/system";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TerraformOptions from "../components/terraformOptions";
import Card from "@mui/material/Card";
import {CardActionArea} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";

export default function TerraformManager(props: {
	selectedRepo: string;
	backButton: () => void;
}) {
	const defaultCardSize = 250;
	const [selectedNewInstance, setSelectNewInstance] = React.useState(false);

	const selectedNewInstanceCallback = () => {
		setSelectNewInstance(true);
	};

	return (
		<Box sx={{width: "100%"}}>
			<Typography sx={{paddingTop: 4, marginBottom: 3}} variant="h4">
				Terraform
			</Typography>
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
						<CardActionArea onClick={selectedNewInstanceCallback}>
							{!selectedNewInstance && (
								<AddIcon
									sx={{
										width: defaultCardSize,
										height: defaultCardSize,
										opacity: 0.5
									}}
								/>
							)}
						</CardActionArea>
						{selectedNewInstance && (
							<TerraformOptions
								selectedRepo={props.selectedRepo}
							/>
						)}
					</Card>
				</Grid>
				{/* Populate previous instances here - Create terraformCards */}
			</Grid>
		</Box>
	);
}
