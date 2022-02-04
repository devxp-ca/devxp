import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import LoginWithGithub from "./loginWithGithub";
import {ThemeProvider, useTheme} from "@mui/material/styles";
import {darkTheme} from "../darkTheme";

export default function Navbar() {
	return (
		<ThemeProvider theme={darkTheme}>
			<Box sx={{flexGrow: 1}}>
				<AppBar position="static">
					<Toolbar>
						<Box sx={{display: {xs: "none", md: "flex"}}}>
							<Button href="/" color="primary">
								Home
							</Button>
							<Button href="/wizard" color="primary">
								Wizard
							</Button>
							<Button href="/about" color="primary">
								About
							</Button>
							<Button href="/contact" color="primary">
								Contact
							</Button>
						</Box>
						<Box sx={{flexGrow: 1}} />
						<Box sx={{display: {xs: "none", md: "flex"}}}>
							<LoginWithGithub />
						</Box>
					</Toolbar>
				</AppBar>
			</Box>
		</ThemeProvider>
	);
}
