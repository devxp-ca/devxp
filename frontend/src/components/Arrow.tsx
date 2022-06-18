import Box from "@mui/material/Box";
import React from "react";

export default ({arrow, inverted}: {arrow: any; inverted?: boolean}) => {
	let sx: any = {
		height: "100%",
		backgroundImage: `url(${arrow})`,
		backgroundSize: "contain",
		backgroundPosition: "center center",
		backgroundRepeat: "no-repeat",
		imageRendering: "pixelated"
	};
	if (inverted) {
		sx = {
			...sx,
			"-moz-transform": "scaleY(-1)",
			"-o-transform": "scaleY(-1)",
			"-webkit-transform": "scaleY(-1)",
			transform: "scaleY(-1)",
			filter: "FlipV",
			"-ms-filter": "FlipV"
		};
	}

	return <Box className="arrow" sx={sx}></Box>;
};
