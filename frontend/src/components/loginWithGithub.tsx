import React from "react";
//import {GithubLoginButton} from "react-social-login-buttons";
import GitHubIcon from "@mui/icons-material/GitHub";
import Button from "@mui/material/Button";
import {CONFIG} from "../config";

interface IProps {}
interface IState {}
export default class LoginWithGithub extends React.Component<IProps, IState> {
	render() {
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
}
