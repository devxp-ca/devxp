import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { lightTheme } from "../lightTheme";

export default function MainLandingVisual() {
	return (
		<ThemeProvider theme={lightTheme}>
			<Box sx={{width: '100%', backgroundColor: 'gray', marginTop: 3, paddingTop: 40, paddingBottom: 15}}>
				<Box sx={{width: '100%', textAlign: 'center'}}>
					<Typography variant="h1">DEV XP</Typography>
					<Box sx={{width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)', paddingTop: 4, paddingBottom: 4, textAlign: 'center'}}>
						<Typography variant="h5">DevOps is hard -- We don't believe it has to be</Typography>
						<Button color="secondary" variant="contained" size="large" sx={{marginTop: 2}}>Get Started</Button>
					</Box>
				</Box>
			</Box>
		</ThemeProvider >
	);
}