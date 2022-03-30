import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {BTN_WIDTH, OFFSET_NO_DIV, TRANSITION} from "../../util";

export default function PreviewRender(props: {
	flipped?: boolean;
	data?: string;
}) {
	return (
		<Box
			sx={{
				width: "50vw",
				height: "90vh",
				transition: TRANSITION,
				marginRight: `${OFFSET_NO_DIV}`,
				transform: `translateX(${props.flipped ? 0 : BTN_WIDTH}px)`,
				zIndex: 1
			}}>
			<Paper
				sx={{
					width: "100%",
					height: "100%",
					padding: "4px",
					overflowX: "hidden",
					overflowY: "auto",
					pointerEvents: "all"
				}}>
				<Typography
					sx={{
						overflowX: "hidden",
						overflowY: "auto",
						pointerEvents: "all",
						minHeight: "90vh"
					}}
					paragraph={false}>
					<pre>{props.data ?? ""}</pre>
				</Typography>
			</Paper>
		</Box>
	);
}
