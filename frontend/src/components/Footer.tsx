import * as React from "react";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import Box from "@mui/material/Box";

export default function Footer() {
	return (
		<Box sx={{position: "absolute", left: 0, bottom: 5, right: 0}}>
			<Typography variant="body2" color="text.secondary" align="center">
				{"Copyright © "}
				<MuiLink color="inherit">DevXP</MuiLink>{" "}
				{new Date().getFullYear()}
				{"."}
			</Typography>
		</Box>
	);
}