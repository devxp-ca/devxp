import * as React from "react";
import {useTheme} from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import GenericModal from "./GenericModal";
import {
	Card,
	CardActionArea,
	Typography,
	Stack,
	Icon,
	Button,
	CardActions
} from "@mui/material";
import {RESOURCE_LIST} from "../resources/resourceList";
import {} from "@mui/material";
import {Storage, BackupTable as Icons} from "@mui/icons-material";

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
	const currentTheme = useTheme();
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
									backgroundColor: "#FFF",
									"&:hover": {
										backgroundColor: `${currentTheme.palette.info.main}10`
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
										alignItems="stretch">
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
										sx={{p: 0.5}}
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
