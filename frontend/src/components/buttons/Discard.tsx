import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

export default ({
	disabled,
	onClick
}: {
	disabled: boolean;
	onClick: () => void;
}) => {
	return (
		<Grid item>
			<Button
				disabled={disabled}
				variant="contained"
				color="error"
				size="large"
				startIcon={<DeleteIcon />}
				aria-label="discard changes"
				onClick={onClick}
				sx={{
					width: "281px",
					padding: 2,
					fontSize: 18,
					pointerEvents: "initial"
				}}>
				Discard Changes
			</Button>
		</Grid>
	);
};
