import * as React from "react";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export default function Footer() {
	return (
		<Grid
			container
			direction="column"
			sx={{
				backgroundColor: "primary",
				position: "fixed",
				left: 0,
				bottom: 0,
				right: 0
			}}>
			<Typography variant="body2" color="text.secondary" align="center">
				<MuiLink
					href="https://github.com/devxp-ca/devxp/wiki"
					color="inherit"
					target="_blank"
					rel="noopener noreferrer">
					Wiki
				</MuiLink>
			</Typography>
			<Typography variant="body2" color="text.secondary" align="center">
				{"Copyright © "}
				<MuiLink href="https://github.com/devxp-ca" color="inherit">
					DevXP
				</MuiLink>{" "}
				{new Date().getFullYear()}
				{"."}
			</Typography>
		</Grid>
	);
}
