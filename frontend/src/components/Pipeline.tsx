import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import React from "react";
import arrowInfo from "../assets/arrow-info.png";
import arrowSecondary from "../assets/arrow-secondary.png";
import Arrow from "./Arrow";
import {useTheme} from "@mui/material/styles";

export default ({
	disabled,
	secondary,
	title,
	description
}: {
	disabled?: boolean;
	secondary?: boolean;
	title: string;
	description: string;
}) => {
	const theme = useTheme();

	return (
		<>
			<Paper
				elevation={4}
				sx={{
					width: "100%",
					minHeight: "7.5vh",
					transition: "0.15s",
					borderColor: "info.main",
					borderWidth: 1,
					borderStyle: "solid",
					borderRadius: 1,
					":hover": {
						transform: "scale(1.01, 1.15)",
						"h5, p": {
							transform: "scale(0.9900990099, 0.86956521739)"
						}
					},
					backgroundColour:
						theme.palette.mode === "dark" ? "#00000040" : "#DDD",
					display: "block"
				}}>
				<Button
					disabled={disabled}
					sx={{
						width: "100%",
						height: "100%"
					}}>
					<Grid
						container
						direction="row"
						sx={{
							width: "100%",
							alignItems: "center"
						}}>
						<Typography
							variant="h5"
							sx={{
								transition: "0.15s",
								width: "7.5vw",
								margin: "1rem",
								display: "inline",
								color: "secondary.dark",
								fontWeight: "bolder"
							}}>
							{title}
						</Typography>
						<Typography
							sx={{
								transition: "0.15s",
								margin: "1rem",
								color: "secondary.dark",
								fontWeight: "lighter"
							}}>
							{description}
						</Typography>
					</Grid>
				</Button>
			</Paper>
			<Arrow
				inverted={true}
				arrow={secondary ? arrowSecondary : arrowInfo}
			/>
		</>
	);
};
