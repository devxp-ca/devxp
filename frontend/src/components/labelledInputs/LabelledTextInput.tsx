import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MouseOverPopover from "../MouseOverPopover";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import HelpIcon from "@mui/icons-material/Help";
import {usePrevious} from "../../util";

export interface LabelledTextInputProps {
	text: string | React.ReactElement;
	description: string | React.ReactElement;
	onChange?: (value: string) => void;
	onChangeValidity?: (value: boolean) => void;
	initial?: string;
	pattern?: string;
	disabled?: boolean;
	override?: string;
}

export default function LabelledTextInput(props: LabelledTextInputProps) {
	const regex = new RegExp(props.pattern ?? ".*");
	const [value, setValue] = React.useState(props.initial ?? "");
	const [valid, setValid] = React.useState(true);
	const [shouldFocus, setShouldFocus] = React.useState(false);

	const prevProp = usePrevious({
		override: props.override,
		disabled: props.disabled
	});

	React.useEffect(() => {
		if (
			props.override !== undefined &&
			prevProp?.override !== props.override
		) {
			setValue(props.override);
		}
	}, [props.override]);

	React.useEffect(() => {
		if (!props.disabled && prevProp?.disabled !== props.disabled) {
			setShouldFocus(true);
		} else {
			setShouldFocus(false);
		}
	}, [props.disabled]);

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
						inputRef={(input?: HTMLInputElement) =>
							input && shouldFocus && input.focus()
						}
						error={!valid}
						inputProps={{
							pattern: props.pattern ?? ".*"
						}}
						label=""
						type="text"
						disabled={props.disabled ?? false}
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
