import React from "react";
import Grid from "@mui/material/Grid";
import {getRandomId, randomIdSettings, usePrevious} from "../../util";
import LabelledTextInput, {LabelledTextInputProps} from "./LabelledTextInput";
import Checkbox from "@mui/material/Checkbox";

export default function LabelledTextInputWithRandom(
	props: Omit<LabelledTextInputProps, "override"> & randomIdSettings
) {
	const [checked, setChecked] = React.useState(!!props.initial);

	const id = getRandomId({...props});

	const [innerValue, setInnerValue] = React.useState(props.initial ?? "");

	let subProps: LabelledTextInputProps = {
		...props,
		onChange: (value: string) => {
			setInnerValue(value);
			if (props.onChange) {
				props.onChange(value);
			}
		},
		disabled: !checked
	};

	const prevState = usePrevious({checked});
	if (checked !== prevState?.checked) {
		subProps = {
			...subProps,
			override: !checked ? id : innerValue
		};
	}

	React.useEffect(() => {
		if (props.onChange) {
			props.onChange(id);
		}
	}, []);

	return (
		<Grid container direction="row">
			<Checkbox
				sx={{
					"& .MuiSvgIcon-root": {
						fontSize: 28
					},
					marginTop: "25px"
				}}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					setChecked(event.target.checked);
				}}
				checked={checked}
			/>
			<LabelledTextInput {...subProps} />
		</Grid>
	);
}
