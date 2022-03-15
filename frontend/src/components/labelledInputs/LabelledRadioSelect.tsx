import React from "react";
import Grid from "@mui/material/Grid";
import MouseOverPopover from "../MouseOverPopover";
import HelpIcon from "@mui/icons-material/Help";
import {FormControlLabel, Radio, RadioGroup, Typography} from "@mui/material";

export default function LabelledRadioInput(props: {
	text: string | React.ReactElement;
	description: string | React.ReactElement;
	onChange?: (value: string) => void;
	initial?: string;
	options: {
		key: string;
		label: string;
		disabled?: boolean;
	}[];
}) {
	const [value, setValue] = React.useState(
		props.initial ?? props.options[0]?.key ?? ""
	);

	return (
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
			<RadioGroup
				name="Provider"
				value={value}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					setValue(event.target.value);
					if (props.onChange) {
						props.onChange(event.target.value);
					}
				}}
				row
				sx={{paddingLeft: 2}}>
				{props.options.map(option => (
					<FormControlLabel
						key={`radio-${option.key}-key`}
						value={option.key}
						control={<Radio size="small" />}
						label={option.label}
						disabled={option.disabled ?? false}
					/>
				))}
			</RadioGroup>
		</Grid>
	);
}
