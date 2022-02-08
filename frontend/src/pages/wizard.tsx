import React from "react";
import Navbar from "../components/Navbar";
import Accordion from "../components/Accordion";
import Typography from "@mui/material/Typography";
import Footer from "../components/Footer";
import Container from "@mui/material/Container";
import PersistentDrawer from "../components/PersistentDrawer";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {lightTheme} from "../lightTheme";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

interface IProps {}
interface IState {}
export default class Wizard extends React.Component<IProps, IState> {
	render() {
		return (
			<ThemeProvider theme={lightTheme}>
				<Container>
					<Navbar />
					<PersistentDrawer
						repos={["Project 1", "Project 2", "Project 3"]}
					/>
					<Accordion
						title="Linter Settings"
						content={
							<Grid
								container
								direction="row"
								justifyContent="center"
								alignItems="center">
								<Grid
									item
									xs
									justifyContent="center"
									alignItems="center">
									<FormControlLabel
										control={<Checkbox defaultChecked />}
										label="Use Prettier"
									/>
								</Grid>
								<Grid
									item
									xs
									justifyContent="center"
									alignItems="center">
									<FormGroup>
										<FormControlLabel
											control={
												<Checkbox defaultChecked />
											}
											label="Use Tabs"
										/>
										<TextField
											InputLabelProps={{
												style: {pointerEvents: "auto"}
											}}
											label={
												<div>
													<Tooltip title="The number of spaces to use for indentation.">
														<Typography>
															Tab Width (in
															spaces)
														</Typography>
													</Tooltip>
												</div>
											}
											variant="outlined"
											type="text"
										/>
									</FormGroup>
								</Grid>
							</Grid>
						}
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
