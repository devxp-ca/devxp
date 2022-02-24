import React from "react";
//import {GithubLoginButton} from "react-social-login-buttons";
import GitHubIcon from "@mui/icons-material/GitHub";
import Button from "@mui/material/Button";

export default function LoginWithGithub(props: {
	isLoggedIn: boolean;
	handleLogin: () => void;
}) {
	return (
		<Button
			color="inherit"
			startIcon={<GitHubIcon />}
			onClick={props.handleLogin}>
			{props.isLoggedIn ? "Logout" : "Login with Github"}
		</Button>
	);
}
