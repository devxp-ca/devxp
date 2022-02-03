import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import LoginWithGithub from "./loginWithGithub";

export default function Navbar() {
	return (
		<Box sx={{flexGrow: 1}}>
			<AppBar position="static">
				<Toolbar>
					<Box sx={{display: {xs: "none", md: "flex"}}}>
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
					<Box sx={{display: {xs: "none", md: "flex"}}}>
						<LoginWithGithub />
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
