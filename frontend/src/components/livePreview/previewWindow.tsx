import * as React from "react";
import Box from "@mui/material/Box";
import SlidingWindow from "./slidingWindow";
import ArrowButton from "./arrowButton";
import PreviewRender from "./previewRender";

export default function PreviewWindow(props: {data?: string; error?: boolean}) {
	const [flipped, setFlipped] = React.useState(false);

	return (
		<>
			<SlidingWindow flipped={flipped} zIndex={1}>
				<Box
					sx={{
						pointerEvents: "all",
						imageRendering: "pixelated"
					}}
					onClick={() => {
						setFlipped(!flipped);
					}}>
					<ArrowButton flipped={flipped} />
				</Box>
			</SlidingWindow>
			<SlidingWindow flipped={flipped}>
				<PreviewRender
					flipped={flipped}
					data={props.data}
					error={props.error}
				/>
			</SlidingWindow>
		</>
	);
}
