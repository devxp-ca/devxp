import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

export default function profileCard(props: {
	title: string;
	desc: string;
	image: string;
	href: string;
}) {
	return (
		<Link
			sx={{
				textDecoration: "none",
				color: "inherit",
				margin: "2rem",
				"&:hover": {
					transform: "scale(1.1)"
				},
				transition: "transform ease 0.25s"
			}}
			href={props.href}
			target="_blank">
			<Grid item sx={{width: 300, backgroundColor: "transparent"}}>
				<Grid sx={{padding: 4, paddingBottom: 0, borderRadius: 2}}>
					<CardMedia
						component="img"
						image={props.image}
						sx={{
							borderRadius: "4px 4px 0px 0px"
						}}
					/>
				</Grid>
				<Grid>
					<Card
						sx={{
							maxWidth: 345,
							backgroundColor: "secondary.light"
						}}>
						<CardContent
							sx={{
								backgroundColor: "info.main",
								lineHeight: "2.5ex",
								height: "6ex",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}}>
							<Typography
								variant="h5"
								component="div"
								color="black"
								align="center">
								{props.title}
							</Typography>
						</CardContent>
						<CardContent
							sx={{
								backgroundColor: "transparent",
								lineHeight: "2.5ex",
								height: "10ex",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}}>
							<Typography
								variant="body2"
								color={"primary.light"}
								align="center">
								{props.desc}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Link>
	);
}
