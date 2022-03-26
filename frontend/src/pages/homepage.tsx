import React from "react";
import Navbar from "../components/Navbar";
import MainLandingVisual from "../components/mainLandingVisual";
import Footer from "../components/Footer";
import Container from "@mui/material/Container";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {lightTheme} from "../style/themes";
import {Box} from "@mui/system";

interface IProps {}
interface IState {}
export default class Homepage extends React.Component<IProps, IState> {
	render() {
		return (
			<ThemeProvider theme={lightTheme}>
				<Box
					sx={{
						minHeight: "100vh",
						display: "flex",
						backgroundColor: "#0f101a"
					}}>
					<Box
						style={{
							width: "100%",
							paddingLeft: 30,
							paddingRight: 30
						}}>
						<Navbar />
					</Box>
					<MainLandingVisual />
				</Box>
				<Footer />
			</ThemeProvider>
		);
	}
}
