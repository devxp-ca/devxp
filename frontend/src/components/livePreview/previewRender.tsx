import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {BTN_WIDTH, OFFSET_NO_DIV, TRANSITION} from "../../util";

export default function PreviewRender(props: {
	flipped?: boolean;
	data?: string;
	raw?: boolean;
	error?: boolean;
}) {
	const [data, setData] = React.useState(props.data ?? "");
	const [opac, setOpac] = React.useState(1);
	const [colour, setColour] = React.useState("inherit");

	React.useEffect(() => {
		const raw = props.data; //hljs.highlightAuto(props.data).value;

		//Just in case
		const escaped = raw.replace(/<[^>]*script>/g, "");
		let highlighted = escaped.replace(
			/"([^"]+)"/g,
			(_match, $1) => `<span class="highlight-string">"${$1}"</span>`
		);
		highlighted = highlighted.replace(
			/(false|true|null)/g,
			(_match, $1) => `<span class="highlight-literal">${$1}</span>`
		);
		highlighted = highlighted.replace(
			/^([a-zA-Z-_0-9]+) /gm,
			(_match, $1) => `<span class="highlight-keyword">${$1}</span> `
		);
		highlighted = highlighted.replace(
			/ ([0-9]+)$/gm,
			(_match, $1) => ` <span class="highlight-number">${$1}</span>`
		);

		highlighted = highlighted.replace(
			/^#(.*)$/gm,
			(_match, $1) => `<span class="highlight-comment">#${$1}</span>`
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
					paddingLeft: 6,
					paddingRight: 2,
					paddingTop: 2,
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
						"& .highlight-string": {
							color: "error.main"
						},
						"& .highlight-number": {
							color: "secondary.main"
						},
						"& .highlight-keyword": {
							color: "primary.main"
						},
						"& .highlight-literal": {
							color: "warning.main"
						},
						"& .highlight-comment": {
							color: "#888"
						},
						backgroundColor: `${colour}10`
					}}
					component="div"
					paragraph={false}>
					<pre
						style={{
							transition: "all ease 0.2s",
							opacity: opac,
							color: colour
						}}>
						<code
							className="language-terraform"
							dangerouslySetInnerHTML={{
								__html: `${data}<div style="margin-top: 4rem;"></div>`
							}}
						/>
					</pre>
				</Typography>
			</Paper>
		</Box>
	);
}
