import React from "react";
import Navbar from "../components/Navbar";
import Accordion from "../components/Accordion";
import Typography from "@mui/material/Typography";
import Footer from "../components/Footer";
import Container from "@mui/material/Container";
import PersistentDrawer from "../components/PersistentDrawer";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {lightTheme} from "../lightTheme";

interface IProps {}
interface IState {}
export default class Wizard extends React.Component<IProps, IState> {
	render() {
		return (
			<ThemeProvider theme={lightTheme}>
				<Container maxWidth="lg">
					<Navbar />
					<PersistentDrawer
						repos={["Project 1", "Project 2", "Project 3"]}
					/>
					<Typography variant="h6">
						This is the config wizard which appears after successful
						OAuth
					</Typography>
					<Accordion
						title="Linter Settings"
						content="Settings go here"
					/>
					<Accordion
						title="Commit Hooks"
						content="Settings go here"
					/>
					<Accordion title="CI/CD" content="Settings go here" />
					<Footer />
				</Container>
			</ThemeProvider>
		);
	}
}
