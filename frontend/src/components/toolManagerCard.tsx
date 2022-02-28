import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {CardActionArea} from "@mui/material";

export default function ToolManagerCard(props: {onClick: () => void}) {
	return (
		<Card sx={{maxWidth: 345}}>
			<CardActionArea onClick={props.onClick}>
				<CardMedia component="img" height="200" />
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						Terraform
					</Typography>
					<Typography variant="body2" color="text.secondary">
						An infrastructure as code tool that can manage all your
						cloud resource needs
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}
