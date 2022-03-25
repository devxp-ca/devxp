import React from "react";
import Grid from "@mui/material/Grid";
import MouseOverPopover from "../MouseOverPopover";
import HelpIcon from "@mui/icons-material/Help";
import {FormLabel, MenuItem, Select, Typography} from "@mui/material";

export default function LabelledMultiInput(props: {
	text: string | React.ReactElement;
	description: string | React.ReactElement;
	onChange?: (value: string) => void;
	initial?: string;
	options: {
		key: string;
		label: string;
	}[];
	formStyle?: boolean;
}) {
	const [value, setValue] = React.useState(props.initial ?? "");

	React.useEffect(() => {
		if (props.initial) {
			setValue(props.initial);
		}
	}, [props.initial]);

	return (
		<Grid
			container
			direction="row"
			sx={{
				display: "flex",
				alignItems: "center",
				flexDirection: "row"
			}}>
			{props.formStyle ? (
				<FormLabel>{props.text}</FormLabel>
			) : (
				<Typography variant="h6">{props.text}</Typography>
			)}
			<MouseOverPopover
				icon={
					<HelpIcon
						sx={{
							paddingLeft: "10px",
							paddingRight: "10px",
							opacity: 0.5
						}}
					/>
				}
				popOverInfo={<span>{props.description}</span>}
			/>
			<Select
				sx={{
					minWidth: `${props.options.reduce(
						(acc, opt) => Math.max(acc, opt.label.length),
						0
					)}ch`
				}}
				value={value}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					setValue(event.target.value);
					if (props.onChange) {
						props.onChange(event.target.value);
					}
				}}>
				{props.options.map(option => (
					<MenuItem
						key={`radio-${option.key}-key`}
						value={option.key}>
						{option.label}
					</MenuItem>
				))}
			</Select>
		</Grid>
	);
}
