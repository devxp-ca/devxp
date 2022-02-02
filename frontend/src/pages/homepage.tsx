import React from "react";
import LoginWithGithub from "../components/loginWithGithub";
import Navbar from "../components/Navbar";
import Typography from "@mui/material/Typography";
import MouseOverPopover from "../components/MouseOverPopover";

interface IProps {}
interface IState {}
export default class Homepage extends React.Component<IProps, IState> {
	render() {
		return (
			<>
				<Navbar />
				<MouseOverPopover text ='Hello World' popOverInfo="Hello World but in popover"/>
			</>
		);
	}
}
