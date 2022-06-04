import React from "react";
import Navbar from "../components/Navbar";
//import MainLandingVisual from "../components/mainLandingVisual";
const MainLandingVisual = React.lazy(
	() => import("../components/mainLandingVisual")
);

import ProductPage from "../components/ProductPage";
import Footer from "../components/Footer";
import Grid from "@mui/material/Grid";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import useMediaQuery from "@mui/material/useMediaQuery";
import {darkTheme} from "../style/themes";
import {Element, scroller} from "react-scroll";
import GlobalStyles from "@mui/material/GlobalStyles";

export default function Homepage() {
	//True if screen width > 600px, else false
	const isMobile = useMediaQuery("(max-width:600px)");

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
							paddingLeft: isMobile === true ? 0 : 6,
							paddingRight: isMobile === true ? 0 : 6
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
						<React.Suspense
							fallback={
								<Grid
									item
									sx={{
										width: "100%",
										backgroundColor: "primary.dark",
										zIndex: 3
									}}
								/>
							}>
							<MainLandingVisual
								onClick={() => {
									scroller.scrollTo("DevXP-Product-Title", {
										duration: 1000,
										delay: 100,
										smooth: true
									});
								}}
							/>
						</React.Suspense>
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
