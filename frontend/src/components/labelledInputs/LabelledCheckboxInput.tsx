import React from "react";
import Grid from "@mui/material/Grid";
import MouseOverPopover from "../MouseOverPopover";
import HelpIcon from "@mui/icons-material/Help";

import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

export default function LabelledCheckboxInput(props: {
	text: string | React.ReactElement;
	description: string | React.ReactElement;
	onChange?: (value: boolean) => void;
	initial?: boolean;
	disabled?: boolean;
}) {
	const [value, setValue] = React.useState(props.initial ?? false);

	React.useEffect(() => {
		if (props.initial) {
			setValue(props.initial);
		}
	}, [props.initial]);

	return (
		<>
			<Grid container direction="row">
				<Typography
					sx={{paddingTop: 0.4}}
					variant="h6"
					color={props.disabled ? "#545454" : "inherit"}>
					{props.text}
				</Typography>
				<MouseOverPopover
					icon={
						<HelpIcon
							sx={{
								paddingLeft: 1,
								paddingTop: 0.85,
								opacity: 0.5
							}}
						/>
					}
					popOverInfo={<span>{props.description}</span>}
				/>
				<Checkbox
					disabled={props.disabled ?? false}
					sx={{
						"& .MuiSvgIcon-root": {
							fontSize: 28
						},
						marginTop: -0.45
					}}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setValue(event.target.checked);
						if (props.onChange) {
							props.onChange(event.target.checked);
						}
					}}
					checked={value}
				/>
			</Grid>
		</>
	);
}
