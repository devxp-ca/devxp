import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MouseOverPopover from "../MouseOverPopover";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import HelpIcon from "@mui/icons-material/Help";

export default function LabelledNumberInput(props: {
	text: string | React.ReactElement;
	description: string | React.ReactElement;
	onChange?: (value: number) => void;
	initial?: number;
	disabled?: boolean;
}) {
	const [value, setValue] = React.useState(props.initial ?? 1);

	return (
		<>
			<Grid item>
				<FormControl>
					<FormLabel>
						<Grid container direction="row">
							{props.text}
							<MouseOverPopover
								icon={
									<HelpIcon
										sx={{
											paddingLeft: 1
										}}
									/>
								}
								popOverInfo={<div>{props.description}</div>}
							/>
						</Grid>
					</FormLabel>
					<TextField
						label=""
						disabled={props.disabled ?? false}
						type="number"
						value={value ?? ""}
						onChange={(
							event: React.ChangeEvent<HTMLInputElement>
						) => {
							if (event.target.value === "") {
								setValue(undefined);
								if (props.onChange) {
									props.onChange(0);
								}
							} else {
								const num = parseInt(event.target.value);
								if (!isNaN(num) && num > 0) {
									setValue(num);
									if (props.onChange) {
										props.onChange(num);
									}
								}
							}
						}}
					/>
				</FormControl>
			</Grid>
		</>
	);
}
