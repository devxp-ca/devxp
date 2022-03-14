import React from "react";
import Grid from "@mui/material/Grid";
import MouseOverPopover from "../MouseOverPopover";
import HelpIcon from "@mui/icons-material/Help";
import {Checkbox, Typography} from "@mui/material";

export default function LabelledCheckboxInput(props: {
	text: string | Element;
	description: string | Element;
	onChange?: (value: boolean) => void;
	initial?: boolean;
}) {
	const [value, setValue] = React.useState(props.initial ?? false);

	return (
		<>
			<Grid container direction="row">
				<Typography sx={{paddingTop: 0.4}} variant="h6">
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
