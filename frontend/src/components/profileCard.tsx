import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import {Link} from "@mui/material";

export default function profileCard(props: {
	url: string;
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
					<Link
						sx={{
							textDecoration: "none"
						}}
						href={props.url}
						target="_blank">
						<CardActionArea>
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
									align="center"
									sx={{
										lineHeight: "2.5ex",
										height: "4ex",
										display: "flex",
										alignItems: "center",
										justifyContent: "center"
									}}>
									{props.desc}
								</Typography>
							</CardContent>
						</CardActionArea>
					</Link>
				</Card>
			</Grid>
		</Grid>
	);
}
