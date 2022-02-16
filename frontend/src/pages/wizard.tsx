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
}

export default function Wizard() {
	const [repoList, setRepoList] = React.useState([]);

	//this is the same as componentDidMount
	React.useEffect(() => {
		axios
			.get(`https://${CONFIG.BACKEND_URL}${CONFIG.REPO_PATH}`)
			.then((response: any) => {
				console.dir(response.data);
				setRepoList(response.data.repos);
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
				<PersistentDrawer repos={repoList} />
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
