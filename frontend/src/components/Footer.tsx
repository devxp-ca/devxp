import * as React from "react";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

export default function Footer() {
	return (
		<Box
			sx={{
				backgroundColor: "primary.dark",
				position: "relative",
				bottom: 0,
				pointerEvents: "none"
			}}>
			<Grid
				container
				direction="row"
				columns={3}
				sm={12}
				lg={6}
				spacing={{sm: 25, lg: 50}}
				justifyContent="center"
				sx={{
					root: {
						padding: 0
					}
				}}>
				<Grid item sx={{paddingTop: "2px"}}>
					<Typography variant="h6" color="primary.light">
						Contact the{" "}
						<MuiLink
							sx={{
								pointerEvents: "all"
							}}
							href="https://github.com/orgs/devxp-ca/people"
							color="inherit"
							target="_blank"
							rel="noopener noreferrer">
							developers
						</MuiLink>
					</Typography>
				</Grid>
				<Grid item sx={{paddingTop: "2px"}}>
					<Typography variant="h6" color="primary.light">
						Find more on the{" "}
						<MuiLink
							sx={{
								pointerEvents: "all"
							}}
							href="https://github.com/devxp-ca/devxp/wiki"
							color="inherit"
							target="_blank"
							rel="noopener noreferrer">
							wiki
						</MuiLink>
					</Typography>
				</Grid>
			</Grid>
			<Divider />
			<Typography
				variant="h6"
				align="center"
				color="primary.light"
				sx={{padding: 2}}>
				{"Copyright © "}
				<MuiLink
					sx={{
						pointerEvents: "all"
					}}
					href="https://github.com/devxp-ca"
					color="inherit"
					target="_blank"
					rel="noopener noreferrer">
					DevXP
				</MuiLink>{" "}
				{new Date().getFullYear()}
				{"."}
			</Typography>
		</Box>
	);
}
