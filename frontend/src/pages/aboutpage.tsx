import React from "react";
import Navbar from "../components/Navbar";

import Footer from "../components/Footer";
import Grid from "@mui/material/Grid";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {darkTheme} from "../style/themes";
import ProfileCard from "../components/profileCard";
import Typography from "@mui/material/Typography";
import GlobalStyles from "@mui/material/GlobalStyles";

import brennan from "../assets/brennan.jpg";
import chris from "../assets/chris.jpg";
import derek from "../assets/derek.jpg";
import keanu from "../assets/keanu.jpg";
import sabrina from "../assets/sabrina.jpg";

//Trigger deployment
interface IProps {}
interface IState {}
export default class AboutPage extends React.Component<IProps, IState> {
	render() {
		return (
			<ThemeProvider theme={darkTheme}>
				<GlobalStyles
					styles={theme => ({
						html: {backgroundColor: theme.palette.secondary.light}
					})}
				/>
				<Grid
					container
					direction="column"
					sx={{
						backgroundColor: "primary.dark",
						width: "auto"
					}}>
					<Grid
						container
						direction="column"
						sx={{
							minHeight: "100vh",
							backgroundColor: "primary.dark",
							width: "auto"
						}}>
						<Grid
							item
							sx={{
								width: "100%",
								paddingLeft: 6,
								paddingRight: 6
							}}>
							<Navbar />
							<Grid
								item
								sx={{
									width: "100%",
									paddingTop: 8,
									paddingBottom: 2
								}}>
								<Typography
									variant="h4"
									component="div"
									color="white"
									paddingBottom={2}>
									About DevXP
								</Typography>
								<Typography
									variant="h6"
									component="div"
									color="gray"
									paddingBottom={6}>
									DevXP was started in January 2022 as part of
									a startup programming course at the
									University of Victoria.
								</Typography>
								<Typography
									variant="h4"
									component="div"
									color="info.main">
									The DevXP Team:
								</Typography>
							</Grid>
							<Grid
								item
								container
								direction="row"
								justifyContent="space-around"
								alignItems="flex-start"
								sx={{
									width: "100%",
									paddingBottom: 4
								}}>
								<ProfileCard
									onClick={() => {
										window.open(
											"https://www.linkedin.com/in/brennan-wilkes/"
										);
									}}
									title="Brennan Wilkes"
									desc="Lead Developer and Technical Architect"
									image={brennan}
								/>
								<ProfileCard
									onClick={() => {
										window.open(
											"https://www.linkedin.com/in/cpetrone/"
										);
									}}
									title="Christopher Petrone"
									desc="Full Stack Developer"
									image={chris}
								/>
								<ProfileCard
									onClick={() => {
										window.open(
											"https://www.linkedin.com/in/derek-robinson1020/"
										);
									}}
									title="Derek Robinson"
									desc="User Researcher and Full Stack Developer"
									image={derek}
								/>
								<ProfileCard
									onClick={() => {
										window.open(
											"https://www.linkedin.com/in/keanelek-enns-750419156/"
										);
									}}
									title="Keanelek Enns"
									desc="Technical Project Manager"
									image={keanu}
								/>
								<ProfileCard
									onClick={() => {
										window.open(
											"https://www.linkedin.com/in/sabrina-korsch/"
										);
									}}
									title="Sabrina Korsch"
									desc="Artist, Designer and Frontend Developer"
									image={sabrina}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Footer />
				</Grid>
			</ThemeProvider>
		);
	}
}
