import React from "react";
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
				<Typography variant="h1">
					This is the config wizard which appears after successful
					OAuth
				</Typography>
			</>
		);
	}
}
