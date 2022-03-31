import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {BTN_WIDTH, OFFSET_NO_DIV, TRANSITION} from "../../util";
import hljs from "highlight.js";
import terraform from "../../style/terraform";
terraform();

export default function PreviewRender(props: {
	flipped?: boolean;
	data?: string;
	raw?: boolean;
	error?: boolean;
}) {
	const [data, setData] = React.useState(props.data ?? "");
	const [opac, setOpac] = React.useState(1);
	const [colour, setColour] = React.useState("inherit");

	hljs.initHighlightingOnLoad();
	React.useEffect(() => {
		const raw = hljs.highlightAuto(props.data).value;

		//Just in case
		const escaped = raw.replace(/<[^>]*script>/g, "");
		const highlighted = escaped.replace(
			/(false|true|null)/g,
			(_match, $1) => `<span class="hljs-literal">${$1}</span>`
		);
		setData(highlighted);
		setOpac(0.25);
		setTimeout(() => setOpac(1), 200);
	}, [props.data]);

	React.useEffect(() => {
		if (props.error) {
			setColour("#FF0000");
			setOpac(0.25);
			setTimeout(() => {
				setOpac(1);
				setColour("inherit");
			}, 200);
		}
	}, [props.error]);

	return (
		<Box
			sx={
				props.raw
					? {}
					: {
							width: "50vw",
							height: "90vh",
							transition: TRANSITION,
							marginRight: `${OFFSET_NO_DIV}`,
							transform: `translateX(${
								props.flipped ? 0 : BTN_WIDTH
							}px)`,
							zIndex: 1
					  }
			}>
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
						minHeight: "90vh",
						"& .hljs-string": {
							color: "error.main"
						},
						"& .hljs-number": {
							color: "secondary.main"
						},
						"& .hljs-keyword": {
							color: "primary.main"
						},
						"& .hljs-literal": {
							color: "warning.main"
						},
						backgroundColor: `${colour}10`
					}}
					paragraph={false}>
					<pre
						style={{
							transition: "all ease 0.2s",
							opacity: opac,
							color: colour
						}}>
						<code
							className="language-terraform"
							dangerouslySetInnerHTML={{__html: data}}
						/>
					</pre>
				</Typography>
			</Paper>
		</Box>
	);
}
