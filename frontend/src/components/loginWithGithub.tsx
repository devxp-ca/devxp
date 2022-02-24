import React from "react";
//import {GithubLoginButton} from "react-social-login-buttons";
import GitHubIcon from "@mui/icons-material/GitHub";
import Button from "@mui/material/Button";
import {CONFIG} from "../config";
import {Cookies} from "react-cookie";

export default function LoginWithGithub() {
	//inside of the useState hook, check to see if the access_token is set in the cookies. If it is, then the user is already logged in.
	const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
		const cookies = new Cookies();
		const token = cookies.get("token");
		console.dir(token);
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
			// Maybe: remove the access_token from the cookies
			const cookies = new Cookies();
			cookies.remove("token", {path: "/", domain: ""});
		} else {
			// set the state to logged in
			setIsLoggedIn(true);
			// call the API to get the user's profile
			window.location.href = `https://${CONFIG.BACKEND_URL}${CONFIG.AUTH_PATH}`;
		}
	};

	return (
		<Button
			color="inherit"
			startIcon={<GitHubIcon />}
			onClick={handleLogin}>
			{isLoggedIn ? "Logout" : "Login with Github"}
		</Button>
	);
}
