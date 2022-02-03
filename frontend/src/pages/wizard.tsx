import React from "react";
import Navbar from "../components/Navbar";
import Typography from "@mui/material/Typography";
import Footer from "../components/Footer";

interface IProps {}
interface IState {}
export default class Wizard extends React.Component<IProps, IState> {
	render() {
		return (
			<>
				<Navbar />
				<Typography variant="h1">
					This is the config wizard which appears after successful OAuth
				</Typography>
				<Footer/>
			</>
		);
	}
}
