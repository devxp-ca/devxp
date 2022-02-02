import React from "react";
import LoginWithGithub from "../components/loginWithGithub";
import Navbar from "../components/Navbar";

interface IProps {}
interface IState {}
export default class Homepage extends React.Component<IProps, IState> {
	render() {
		return (
			<>
				<Navbar />
				<h1>Hello World</h1>
			</>
		);
	}
}
