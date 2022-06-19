import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CheckIcon from "@mui/icons-material/Check";
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
				color="success"
				size="large"
				startIcon={<CheckIcon />}
				aria-label="submit to repo"
				onClick={onClick}
				sx={{
					width: "281px",
					padding: 2,
					fontSize: 18,
					pointerEvents: "initial",
					":hover": {
						bgcolor: "success.main",
						opacity: 0.9
					}
				}}>
				Create Pull Request
			</Button>
		</Grid>
	);
};
