import React from "react";
//import {GithubLoginButton} from "react-social-login-buttons";
import GitHubIcon from "@mui/icons-material/GitHub";
import Button from "@mui/material/Button";
import {CONFIG} from "../config";

export default function LoginWithGithub() {
	return (
		<Button
			color="inherit"
			startIcon={<GitHubIcon />}
			onClick={() =>
				(window.location.href = `https://${CONFIG.BACKEND_URL}${CONFIG.AUTH_PATH}`)
			}>
			Login with GitHub
		</Button>
	);
}
