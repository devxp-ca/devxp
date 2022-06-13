import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

export default function ToolManagerCard(props: {
	onClick?: () => void;
	title: string;
	desc: string;
	image: string;
	color: string;
	imagesx?: any;
}) {
	return (
		<Card sx={{maxWidth: 345, backgroundColor: "secondary.light"}}>
			<CardActionArea onClick={props.onClick}>
				<CardMedia
					component="img"
					image={props.image}
					sx={props.imagesx}
				/>
				<CardContent sx={{backgroundColor: `${props.color}50`}}>
					<Typography gutterBottom variant="h5" component="div">
						{props.title}
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{
							lineHeight: "2.5ex",
							height: "5.25ex",
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}}>
						{props.desc}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}
