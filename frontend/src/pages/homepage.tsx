import React from "react";
import Navbar from "../components/Navbar";
import MainLandingVisual from "../components/mainLandingVisual";
import ProductPage from "../components/ProductPage";
import Footer from "../components/Footer";
import Grid from "@mui/material/Grid";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {darkTheme} from "../style/themes";
import {Element, scroller} from "react-scroll";

interface IProps {}
interface IState {}
export default class Homepage extends React.Component<IProps, IState> {
	render() {
		return (
			<ThemeProvider theme={darkTheme}>
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
						</Grid>
						<Grid
							item
							container
							sx={{
								flexGrow: 1,
								paddingTop: 2,
								paddingBottom: 3
							}}>
							<MainLandingVisual
								onClick={() => {
									scroller.scrollTo("DevXP-Product-Title", {
										duration: 1000,
										delay: 100,
										smooth: true
									});
								}}
							/>
						</Grid>
					</Grid>
					<Element name="DevXP-Product-Title">
						<ProductPage />
					</Element>
					<Footer />
				</Grid>
			</ThemeProvider>
		);
	}
}
