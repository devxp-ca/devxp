import * as React from "react";
import {useTheme} from "@mui/material/styles";
import {darkTheme} from "../../style/themes";
import Grid from "@mui/material/Grid";
import GenericModal from "./GenericModal";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import {RESOURCE_LIST} from "../resources/resourceList";
import {} from "@mui/material";

interface modalProps {
	isOpen: boolean;
	handleClose: () => void;
	provider: string;
	title?: string;
	handleClick: (event: any, value: any) => void;
}

export default function TerraformOptionsModal({
	isOpen,
	handleClose,
	provider,
	title,
	handleClick
}: modalProps) {
	const theme = useTheme();
	const currentResources = provider ? (RESOURCE_LIST as any)[provider] : [];

	return (
		<div>
			<GenericModal
				isOpen={isOpen}
				handleClose={handleClose}
				width="90vw"
				title={title || ""}>
				<Stack
					spacing={2}
					direction="column"
					alignItems="stretch"
					justifyContent="center">
					{currentResources.map((value: any, i: number) => (
						<Card key={`options-modal-${i}`}>
							{/* Would like to add some kind of icons down the road */}
							<CardActionArea
								component="a"
								onClick={(event: any) => {
									handleClick(event, value["key"]);
								}}
								sx={{
									backgroundColor: "secondary.light",
									"&:hover": {
										backgroundColor: "info.dark"
									}
								}}>
								<Grid container>
									<Grid
										item
										container
										xs={3}
										direction="column"
										justifyContent="center"
										alignContent="center"
										textAlign="center"
										alignItems="stretch"
										sx={{
											borderColor:
												theme == darkTheme
													? "info.light"
													: "primary.light",
											borderStyle: "solid",
											borderWidth: 2,
											borderRadius: "5px 0px 0px 5px"
										}}>
										<Grid item>
											<Typography
												variant="overline"
												color="gray">
												{value["short_desc"] || ""}
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant="h5">
												{value["name"]}
											</Typography>
										</Grid>
										<Grid item justifyContent="center">
											<div>
												<Button
													size="small"
													variant="text"
													color="info"
													onMouseDown={event =>
														event.stopPropagation()
													}
													onClick={event => {
														event.stopPropagation();
														event.preventDefault();
														window.open(
															value["link"]
														);
													}}>
													Learn More
												</Button>
											</div>
										</Grid>
									</Grid>
									<Grid
										xs={9}
										item
										container
										sx={{
											paddingTop: 0.5,
											paddingBottom: 0.5,
											paddingLeft: 2,
											paddingRight: 2,
											backgroundColor:
												theme == darkTheme
													? "primary.dark"
													: "info.dark"
										}}
										alignContent="center">
										<Grid
											item
											xs={12}
											justifyContent="center">
											<Typography variant="body2">
												{value["description"] ||
													"No description provided."}
											</Typography>
										</Grid>
									</Grid>
								</Grid>
							</CardActionArea>
						</Card>
					))}
				</Stack>
			</GenericModal>
		</div>
	);
}
