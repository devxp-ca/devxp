import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import LoginWithGithub from "./loginWithGithub";
import HomeIcon from "@mui/icons-material/Home";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ConstructionIcon from "@mui/icons-material/Construction";
import {ThemeProvider} from "@mui/material/styles";
import {lightTheme} from "../style/themes";
import {Cookies} from "react-cookie";
import {CONFIG} from "../config";

interface NavbarProps {
	children?: JSX.Element; // Can be used for buttons or any other custom element we want on a modal,
}

export default function Navbar({children}: NavbarProps) {
	const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
		const cookies = new Cookies();
		const token = cookies.get("token");
		if (token) {
			return true;
		} else {
			return false;
		}
	});

	const handleLogin = () => {
		if (isLoggedIn) {
			// set the state to logged out
			setIsLoggedIn(false);
			//remove the access_token from the cookies
			const cookies = new Cookies();
			cookies.remove("token", {path: "/", domain: ""});
			// redirect to the homepage
			window.location.href = "/";
		} else {
			// set the state to logged in
			setIsLoggedIn(true);
			// call the API to login with github
			window.location.href = `${CONFIG.BACKEND_URL}${CONFIG.AUTH_PATH}`;
		}
	};

	return (
		<ThemeProvider theme={lightTheme}>
			<Box sx={{flexGrow: 1}}>
				<AppBar
					position="relative"
					sx={{borderRadius: "0px 0px 4px 4px"}}>
					<Toolbar>
						<Box sx={{display: "flex"}}>
							<Button
								startIcon={<HomeIcon />}
								href="/"
								color="inherit">
								Home
							</Button>
							<Button
								startIcon={<QuestionMarkIcon />}
								onClick={() => {
									window.open(
										"https://github.com/devxp-ca/devxp/wiki"
									);
								}}
								color="inherit">
								Wiki
							</Button>
							{isLoggedIn ? (
								<Button
									startIcon={<ConstructionIcon />}
									href="/toolManager"
									color="inherit">
									Tool Manager
								</Button>
							) : null}
						</Box>
						<Box sx={{flexGrow: 1}} />
						<Box sx={{display: {xs: "flex", md: "flex"}}}>
							{children}
							<LoginWithGithub
								isLoggedIn={isLoggedIn}
								handleLogin={handleLogin}
							/>
						</Box>
					</Toolbar>
				</AppBar>
			</Box>
		</ThemeProvider>
	);
}
