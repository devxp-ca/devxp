import * as React from "react";
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
	//selectedRepo: string;
}

//make two test repos
let testRepo1: GithubRepo = {
	name: "testRepo1",
	full_name: "Test/testRepo1"
};
let testRepo2: GithubRepo = {
	name: "testRepo2",
	full_name: "Test/testRepo2"
};
let repos: GithubRepo[] = [testRepo1, testRepo2];

export default function Wizard() {
	const [repoList, setRepoList] = React.useState([]);
	//const [selectedRepo, setSelectedRepo] = React.useState("");

	//refactor the componentDidMount to a useEffect React hook
	React.useEffect(() => {
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
	}, []);

	/**TODO: Make the submit button at the bottom of the page commit the file with confirmation first*/
	/** <PersistentDrawer repos={this.state.repoList} /> */
	return (
		<ThemeProvider theme={lightTheme}>
			<Box style={{display: "flex"}}>
				<PersistentDrawer repos={repos} />
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
