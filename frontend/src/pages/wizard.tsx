import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Container from "@mui/material/Container";
import PersistentDrawer, {GithubRepo} from "../components/PersistentDrawer";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {lightTheme} from "../lightTheme";
import axios from "axios";
import {CONFIG} from "../config";
import WizardOptions from "../components/wizardOptions";

interface IProps {}
interface IState {
	repoList: GithubRepo[];
}

export default class Wizard extends React.Component<IProps, IState> {
	/*Create a constructor, set the state of the constructor to an empty list.*/
	constructor(props: IProps) {
		super(props);
		this.state = {
			/*Create a state called "repoList" and set it to an empty list.*/
			repoList: []
		};
	}

	componentDidMount() {
		//TODO: add explicit type to "response"
		axios
			.get(`https://${CONFIG.BACKEND_URL}/api/v1/getRepos`)
			.then(response => {
				console.dir(response.data);
				this.setState({
					repoList: response.data.repos
				});
			})
			.catch(error => {
				/**TODO: Render an error component */
				console.log(error);
			});
	}
	/**TODO: Make the submit button at the bottom of the page commit the file with confirmation first*/
	/** <PersistentDrawer repos={this.state.repoList} /> */
	render() {
		return (
			<ThemeProvider theme={lightTheme}>
				<Container>
					<Navbar />
					<PersistentDrawer repos={this.state.repoList} />
					<WizardOptions />
					<Footer />
				</Container>
			</ThemeProvider>
		);
	}
}
