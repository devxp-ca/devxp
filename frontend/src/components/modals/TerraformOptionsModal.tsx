import * as React from "react";
import {lightTheme} from "../../style/themes";
import Grid from "@mui/material/Grid";
import GenericModal from "./GenericModal";
import {Card, CardActionArea, Typography} from "@mui/material";
import {RESOURCE_LIST} from "../resources/resourceList";
import {Stack} from "@mui/material";

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
	const currentTheme = lightTheme;
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
					justifyContent="space-evenly">
					{currentResources.map((value: any, i: number) => (
						<Card key={`options-modal-${i}`}>
							<CardActionArea
								key={value["key"]}
								onClick={(event: any) => {
									handleClick(event, value["key"]);
								}}
								sx={{
									color: "#000",
									backgroundColor: "#FFF",
									"&:hover": {
										backgroundColor:
											currentTheme.palette.primary.main,
										opacity: [0.9, 0.9, 0.9]
									}
								}}>
								{/* Would like to add some kind of icons down the road */}
								<Grid container spacing={2}>
									<Grid item xs={3} justifyContent="center">
										<Typography variant="h5">
											{value["name"]}
										</Typography>
										<Typography sx={{mb: 1.5}}>
											{value["key"]}
										</Typography>
									</Grid>
									<Grid item xs={12} sm container>
										<Grid
											item
											xs={9}
											justifyContent="center">
											<Typography variant="body2">
												{value["description"]}
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
