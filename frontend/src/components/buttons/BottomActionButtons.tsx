import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import CreatePullRequest from "./CreatePullRequest";
import Discard from "./Discard";

export default ({
	pullRequestDisabled,
	discardDisabled,
	pullRequestOnClick,
	discardOnClick
}: {
	pullRequestDisabled: boolean;
	discardDisabled: boolean;
	pullRequestOnClick: () => void;
	discardOnClick: () => void;
}) => {
	const isMobile = useMediaQuery("(max-width:600px)");
	return (
		<Grid
			container
			columns={2}
			justifyContent="center"
			spacing={2}
			sx={{
				paddingTop: 3,
				position: "fixed",
				bottom: 25,
				width: isMobile === true ? "100%" : "calc(100vw - 76px)",
				pointerEvents: "none"
			}}>
			<CreatePullRequest
				disabled={pullRequestDisabled}
				onClick={pullRequestOnClick}
			/>
			<Discard disabled={discardDisabled} onClick={discardOnClick} />
		</Grid>
	);
};
