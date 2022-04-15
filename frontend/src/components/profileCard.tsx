import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";

export default function profileCard(props: {
	onClick: () => void;
	title: string;
	desc: string;
	image: string;
}) {
	return (
		<Grid item sx={{width: 300, backgroundColor: "transparent"}}>
			<Grid sx={{padding: 4, paddingBottom: 0, borderRadius: 2}}>
				<CardMedia
					component="img"
					image={props.image}
					sx={{borderRadius: "4px 4px 0px 0px"}}
				/>
			</Grid>
			<Grid>
				<Card sx={{maxWidth: 345, backgroundColor: "secondary.light"}}>
					<CardActionArea onClick={props.onClick}>
						<CardContent sx={{backgroundColor: "info.main"}}>
							<Typography
								variant="h5"
								component="div"
								color="black"
								align="center">
								{props.title}
							</Typography>
						</CardContent>
						<CardContent sx={{backgroundColor: "transparent"}}>
							<Typography
								variant="body2"
								color={"primary.light"}
								align="center">
								{props.desc}
							</Typography>
						</CardContent>
					</CardActionArea>
				</Card>
			</Grid>
		</Grid>
	);
}
