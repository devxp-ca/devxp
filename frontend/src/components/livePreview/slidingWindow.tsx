import * as React from "react";
import Box from "@mui/material/Box";
import {OFFSET, TRANSITION} from "../../util";

export default function SlidingWindow(props: {
	children?: JSX.Element | JSX.Element[];
	flipped?: boolean;
	zIndex?: number;
}) {
	return (
		<div
			style={{
				position: "absolute",
				height: "100%",
				width: "100%",
				top: 0,
				left: 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				pointerEvents: "none",
				overflow: "hidden",
				zIndex: props.zIndex ?? 0
			}}>
			<Box
				sx={{
					position: "relative",
					right: OFFSET,
					transition: TRANSITION,
					transform: `translateX(${props.flipped ? OFFSET : 0})`
				}}>
				{props.children}
			</Box>
		</div>
	);
}
