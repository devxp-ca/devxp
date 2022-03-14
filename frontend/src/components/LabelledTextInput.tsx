import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MouseOverPopover from "./MouseOverPopover";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import HelpIcon from "@mui/icons-material/Help";

export default function LabelledTextInput(props: {
	text: string;
	description: string;
	onChange?: (value: string) => void;
	onChangeValidity?: (value: boolean) => void;
	initial?: string;
	pattern?: string;
}) {
	const regex = new RegExp(props.pattern ?? ".*");
	const [value, setValue] = React.useState(props.initial ?? "");
	const [valid, setValid] = React.useState(true);

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
						error={!valid}
						inputProps={{
							pattern: props.pattern ?? ".*"
						}}
						label=""
						type="text"
						value={value}
						onChange={(
							event: React.ChangeEvent<HTMLInputElement>
						) => {
							const newValid = !!event.target.value.match(regex);
							setValid(newValid);
							setValue(event.target.value);
							if (props.onChange && newValid) {
								props.onChange(event.target.value);
							}
							if (props.onChangeValidity) {
								props.onChangeValidity(newValid);
							}
						}}
					/>
				</FormControl>
			</Grid>
		</>
	);
}
