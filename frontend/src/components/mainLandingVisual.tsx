import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import Backsplash from "../assets/memories-transparent.gif";
import titleImage from "../assets/logo-lettering.png";
import logo from "../assets/logo.png";
import {Cookies} from "react-cookie";
import {CONFIG} from "../config";

export default function MainLandingVisual(props: {onClick: () => void}) {
	return (
		<Grid
			item
			sx={{
				width: "100%",
				backgroundImage: `url(${Backsplash})`,
				backgroundSize: "contain",
				backgroundPosition: "center top",
				backgroundRepeat: "no-repeat",
				zIndex: 3
			}}>
			<Grid
				container
				alignItems="center"
				justifyContent="center"
				sx={{
					width: "100%",
					textAlign: "center",
					marginTop: "35vh"
				}}>
				<Grid
					item
					sx={{
						width: "100%",
						height: 108,
						backgroundImage: `url(${logo})`,
						backgroundPosition: "center",
						backgroundSize: "contain",
						backgroundRepeat: "no-repeat",
						marginBottom: 1
					}}></Grid>
				<Grid
					sx={{
						width: "100%",
						height: 84,
						backgroundImage: `url(${titleImage})`,
						backgroundPosition: "center",
						backgroundSize: "contain",
						backgroundRepeat: "no-repeat",
						marginBottom: 2
					}}></Grid>
				<Grid item>
					<Box
						sx={{
							backgroundColor: "rgba(0, 0, 0, 0.80)",
							padding: 2,
							borderRadius: 2
						}}>
						<Typography variant="h5" color="white">
							Empowering developers to create enterprise-quality
							cloud infrastructure in minutes
						</Typography>
					</Box>
					<Grid>
						<Button
							onClick={props.onClick}
							color="info"
							variant="contained"
							size="large"
							sx={{
								marginTop: 2,
								marginRight: 1,
								":hover": {
									bgcolor: "info.main",
									color: "white",
									opacity: 0.9
								}
							}}>
							Learn More
						</Button>
						<Button
							onClick={() => {
								if (!!new Cookies().get("token")) {
									window.location.href = "/toolManager";
								} else {
									window.location.href = `${CONFIG.BACKEND_URL}${CONFIG.AUTH_PATH}`;
								}
							}}
							color="info"
							variant="contained"
							size="large"
							sx={{
								marginTop: 2,
								marginLeft: 1,
								":hover": {
									bgcolor: "info.main",
									color: "white",
									opacity: 0.9
								}
							}}>
							Get Started
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
