import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Box from "@mui/material/Box";
import PersistentDrawer, {GithubRepo} from "../components/PersistentDrawer";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {lightTheme} from "../lightTheme";
import axios from "axios";
import {CONFIG} from "../config";
import WizardOptions from "../components/wizardOptions";
import Grid from "@mui/material/Grid";

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
			.get(`https://${CONFIG.BACKEND_URL}${CONFIG.REPO_PATH}`)
			.then((response: any) => {
				console.dir(response.data);
				this.setState({
					repoList: response.data.repos
				});
			})
			.catch((error: any) => {
				/**TODO: Render an error component */
				console.error(error);
			});
	}
	/**TODO: Make the submit button at the bottom of the page commit the file with confirmation first*/
	/** <PersistentDrawer repos={this.state.repoList} /> */
	render() {
		return (
			<ThemeProvider theme={lightTheme}>
				<Box style={{display: "flex"}}>
					<PersistentDrawer repos={this.state.repoList} />
					<Box
						style={{
							width: "100%",
							paddingLeft: 30,
							paddingRight: 30
						}}>
						<Grid container direction="column">
							<Navbar />
							<WizardOptions />
							<Footer />
						</Grid>
					</Box>
				</Box>
			</ThemeProvider>
		);
	}
}
