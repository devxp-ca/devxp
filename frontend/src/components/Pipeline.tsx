import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import React, {useState} from "react";
import arrowInfo from "../assets/arrow-info.png";
import arrowSecondary from "../assets/arrow-secondary.png";
import Arrow from "./Arrow";
import {useTheme, darken, lighten} from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";

export default ({
	disabled,
	secondary,
	title,
	description,
	initial
}: {
	disabled?: boolean;
	secondary?: boolean;
	title: string;
	description: string;
	initial?: boolean;
}) => {
	const theme = useTheme();
	const [used, setUsed] = useState(initial ?? false);

	const textColour = theme.palette.secondary.dark;
	const iD = theme.palette.mode === "dark";

	return (
		<>
			<Paper
				elevation={4}
				sx={{
					width: "100%",
					minHeight: "7.5vh",
					borderColor: "info.main",
					borderWidth: 1,
					borderStyle: "solid",
					borderRadius: 1,
					backgroundColour: iD ? "#00000040" : "#DDD",
					display: "block"
				}}>
				<Button
					sx={{
						width: "100%",
						height: "100%"
					}}
					disableRipple={!used || disabled}>
					<Grid
						container
						direction="row"
						sx={{
							width: "100%",
							alignItems: "center",
							height: "100%",
							":hover": {
								cursor:
									!used || disabled
										? "default !important"
										: ""
							}
						}}>
						<Typography
							variant="h5"
							sx={{
								width: "7.5vw",
								marginLeft: "1rem",
								marginRight: "1rem",
								display: "inline",
								color: disabled
									? (iD ? darken : lighten)(textColour, 0.5)
									: textColour,
								fontWeight: "bolder"
							}}>
							{title}
						</Typography>
						<Typography
							sx={{
								transition: "0.15s",
								margin: "0",
								color: disabled
									? (iD ? darken : lighten)(textColour, 0.5)
									: textColour,
								fontWeight: "lighter"
							}}>
							{description}
						</Typography>
						<Box
							sx={{
								marginLeft: "auto",
								marginRight: "2rem"
							}}>
							<Button
								disableElevation
								disableRipple
								sx={{
									backgroundColor: "transparent !important",
									"& :hover": {
										backgroundColor:
											"transparent !important"
									},
									fontWeight: "bold"
								}}
								disabled={!used || disabled}>
								Edit
							</Button>
							<Switch
								disabled={disabled}
								checked={used}
								onChange={e => setUsed(e.target.checked)}
							/>
						</Box>
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
