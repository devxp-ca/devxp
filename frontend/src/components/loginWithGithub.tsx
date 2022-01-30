import React from "react";
import {GithubLoginButton} from "react-social-login-buttons";
import {CONFIG} from "../config";

interface IProps {}
interface IState {}
export default class LoginWithGithub extends React.Component<IProps, IState> {
	render() {
		return (
			<GithubLoginButton
				onClick={() =>
					(window.location.href = `https://${CONFIG.BACKEND_URL}${CONFIG.AUTH_PATH}`)
				}
			/>
		);
	}
}
