import * as React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Box from "@mui/material/Box";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {lightTheme} from "../style/themes";
import axios from "axios";
import {CONFIG} from "../config";
import ToolManagerCard from "../components/toolManagerCard";
import TerraformManager from "../components/terraformManager";
import TerraformOptions, {
	terraformDataSettings
} from "../components/terraformOptions";
import Grid from "@mui/material/Grid";
import SelectRepoModal from "../components/SelectRepoModal";
import Button from "@mui/material/Button";
import {Autocomplete} from "@mui/material";
import TextField from "@mui/material/TextField";

export default function ToolManager() {
	const [repoList, setRepoList] = React.useState([]);
	const [selectedRepo, setSelectedRepo] = React.useState<string>("");
	const [isRepoSelected, setIsRepoSelected] = React.useState(false);
	const [selectedRepoData, setSelectedRepoData] =
		React.useState<terraformDataSettings>(null);

	const [selectedTool, setSelectedTool] = React.useState<string>("none");

	const setSelectedRepoFromModal = (repo_full_name: string) => {
		console.dir(repo_full_name);
		setSelectedRepo(repo_full_name);
		axios
			.get(`https://${CONFIG.BACKEND_URL}${CONFIG.SETTINGS_PATH}`, {
				headers: {
					repo: repo_full_name
				}
			})
			.then((response: any) => {
				setSelectedRepoData(response.data);
				console.dir(response.data);
			})
			.catch((error: any) => {
				console.error(error);
			});
	};

	const setSelectedToolCardCallback = (tool_name: string) => {
		const callback = () => {
			setSelectedTool(tool_name);
		};
		return callback;
	};

	//on mount, get the list of repos
	React.useEffect(() => {
		//api call to get repos
		axios
			.get(`https://${CONFIG.BACKEND_URL}${CONFIG.REPO_PATH}`)
			.then((response: any) => {
				setRepoList(response.data.repos);
			})
			.catch((error: any) => {
				//TODO: Render an error component
				console.error(error);
			});
	}, []);

	const [openModal, setOpenModal] = React.useState(true);

	const handleCloseModal = (event: any, reason: any) => {
		if (reason !== "backdropClick") {
			setOpenModal(false);
			setIsRepoSelected(true);
		}
	};

	return (
		<ThemeProvider theme={lightTheme}>
			<Box style={{display: "flex"}}>
				<Box
					style={{
						width: "100%",
						paddingLeft: 30,
						paddingRight: 30
					}}>
					<Grid container direction="column">
						<Navbar />
						{!isRepoSelected && (
							<SelectRepoModal
								isOpen={openModal}
								handleClose={handleCloseModal}
								title="Select a Repo"
								bodyText="In order to continue, please select a repository"
								children={[
									<Autocomplete
										sx={{padding: "3px"}}
										id="repo-select"
										options={repoList}
										getOptionLabel={(option: any) =>
											option.full_name
										}
										renderInput={(params: any) => (
											<TextField
												{...params}
												label="Repository"
												variant="outlined"
											/>
										)}
										onChange={(event: any, value: any) => {
											setSelectedRepoFromModal(
												value.full_name
											);
										}}
									/>,
									<Button
										variant="contained"
										color="primary"
										onClick={() => {
											setOpenModal(false);
											setIsRepoSelected(true);
											setSelectedRepoFromModal(
												selectedRepo
											);
										}}>
										Submit
									</Button>
								]}
							/>
						)}
						{selectedTool == "none" && (
							<Grid
								container
								direction="row"
								sx={{paddingTop: 5}}>
								<ToolManagerCard
									onClick={setSelectedToolCardCallback(
										"terraform"
									)}
								/>
							</Grid>
						)}
						{selectedTool == "terraform" && (
							<TerraformManager
								selectedRepo={selectedRepo}
								backButton={setSelectedToolCardCallback("none")}
								repoData={selectedRepoData}
							/>
						)}
						<Footer />
					</Grid>
				</Box>
			</Box>
		</ThemeProvider>
	);
}
