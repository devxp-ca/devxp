import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import LoginWithGithub from "./loginWithGithub";
import {ThemeProvider} from "@mui/material/styles";
import {lightTheme} from "../lightTheme";

export default function Navbar() {
	return (
		<ThemeProvider theme={lightTheme}>
			<Box sx={{flexGrow: 1, marginTop: 5}}>
				<AppBar position="relative">
					<Toolbar>
						<Box sx={{display: {xs: "flex", md: "flex"}}}>
							<Button href="/" color="inherit">
								Home
							</Button>
							<Button href="/wizard" color="inherit">
								Wizard
							</Button>
							<Button href="/about" color="inherit">
								About
							</Button>
							<Button href="/contact" color="inherit">
								Contact
							</Button>
						</Box>
						<Box sx={{flexGrow: 1}} />
						<Box sx={{display: {xs: "flex", md: "flex"}}}>
							<LoginWithGithub />
						</Box>
					</Toolbar>
				</AppBar>
			</Box>
		</ThemeProvider>
	);
}
