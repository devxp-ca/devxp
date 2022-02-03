import React from "react";
import Navbar from "../components/Navbar";
import MouseOverPopover from "../components/MouseOverPopover";
import Footer from "../components/Footer";
import Container from "@mui/material/Container";

interface IProps {}
interface IState {}
export default class Homepage extends React.Component<IProps, IState> {
	render() {
		return (
			<Container maxWidth="lg">
				<Navbar />
				<MouseOverPopover
					text="Hello World"
					popOverInfo="Hello World but in a popover box"
				/>
				<Footer />
			</Container>
		);
	}
}
