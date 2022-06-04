import React from "react";
import Navbar from "../components/Navbar";

import Footer from "../components/Footer";
import Grid from "@mui/material/Grid";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {darkTheme} from "../style/themes";
import ProfileCard from "../components/profileCard";
import Typography from "@mui/material/Typography";
import GlobalStyles from "@mui/material/GlobalStyles";
import Article from "../components/Article";

import articles from "../assets/newsArticles";

//Trigger deployment
interface IProps {}
interface IState {}
export default class NewsPage extends React.Component<IProps, IState> {
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
						minHeight: "100vh",
						backgroundColor: "primary.dark",
						width: "auto"
					}}>
					<Grid
						container
						direction="column"
						sx={{
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
								<Grid
									item
									container
									direction="row"
									justifyContent="start"
									alignItems="end"
									sx={{
										width: "100%",
										paddingBottom: 4
									}}>
									{articles.map(article => (
										<Article
											image={article.image}
											href={article.href}
											title={article.title}
											desc={article.description}
										/>
									))}
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<Footer />
				</Grid>
			</ThemeProvider>
		);
	}
}
