import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default ({
	defaultCardSize,
	onClick
}: {
	defaultCardSize?: number;
	onClick: () => void;
}) => {
	return (
		<Grid item>
			<Button
				variant="outlined"
				color="primary"
				size="large"
				sx={{
					width: (defaultCardSize ?? 250) / 3,
					height: defaultCardSize ?? 250,
					borderWidth: 2
				}}
				onClick={onClick}>
				<ArrowBackIcon />
			</Button>
		</Grid>
	);
};
