import React from "react";
import Navbar from "../components/Navbar";
import Typography from "@mui/material/Typography";
import Footer from "../components/Footer";
import Container from "@mui/material/Container";
import PersistentDrawer from "../components/PersistentDrawer";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {darkTheme} from "../darkTheme";

interface IProps {}
interface IState {}
export default class Wizard extends React.Component<IProps, IState> {
	render() {
		return (
			<ThemeProvider theme={darkTheme}>
				<Container maxWidth="lg">
					<Navbar />
					<PersistentDrawer
						repos={["Project 1", "Project 2", "Project 3"]}
					/>
					<Typography variant="h6">
						This is the config wizard which appears after successful
						OAuth
					</Typography>
					<Footer />
				</Container>
			</ThemeProvider>
		);
	}
}
