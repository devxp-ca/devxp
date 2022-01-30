import React from "react";
import LoginWithGithub from "../components/loginWithGithub";

interface IProps {}
interface IState {}
export default class Homepage extends React.Component<IProps, IState> {
	render() {
		return (
			<>
				<h1>Hello World</h1>
				<LoginWithGithub />
			</>
		);
	}
}
