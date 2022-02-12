import React from "react";
import Button from "@mui/material/Button";
import Accordion from "../components/Accordion";
import {Box} from "@mui/system";
import CheckIcon from "@mui/icons-material/Check";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";

export default function WizardOptions() {
	//TODO: find some way to condense this clunky data setting
	const [providerValue, setProviderValue] = React.useState("");
	const handleChangeProvider = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setProviderValue((event.target as HTMLInputElement).value);
	};

	const handleSubmit = () => {
		//implement 'send text object to backend' here
		//confirmation modal
		//format text
		//send it to backend
	};

	return (
		<div>
			{/* <Accordion title="CI/CD" content="Settings go here" /> */}
			<Accordion
				title="Terraform"
				content={
					<Grid container>
						<Grid item>
							<FormControl>
								<FormLabel>Provider</FormLabel>
								<RadioGroup
									name="Provider"
									value={providerValue}
									onChange={handleChangeProvider}
									row>
									<FormControlLabel
										key="aws"
										value="aws"
										control={<Radio size="small" />}
										label="Amazon"
									/>
									<FormControlLabel
										key="google"
										value="google"
										control={<Radio size="small" />}
										label="Google"
									/>
									<FormControlLabel
										key="other"
										value="other"
										control={<Radio size="small" />}
										label="Azure"
									/>
								</RadioGroup>
							</FormControl>
						</Grid>
					</Grid>
				}
			/>
			<Box textAlign="center" sx={{padding: 3}}>
				<Button
					variant="contained"
					color="success"
					size="large"
					startIcon={<CheckIcon />}
					aria-label="submit to repo"
					onClick={handleSubmit}>
					Submit
				</Button>
			</Box>
		</div>
	);
}
