import {Box, Button, Grid} from "@mui/material";
import React from "react";
import {randomIdSettings} from "../../util";
import LabelledNumberInput from "../labelledInputs/LabelledNumberInput";
import LabelledTextInputWithRandom from "../labelledInputs/LabelledTextInputWithRandom";
import CheckIcon from "@mui/icons-material/Check";
import equal from "deep-equal";
import LabelledCheckboxInput from "../labelledInputs/LabelledCheckboxInput";

interface IProps {
	//Ec2, S3, etc
	resource?: string;

	//Adds delete button essentially
	isModifying?: boolean;

	//Hot-reloading onChange callback
	onChange?: (data: any) => void;

	//Callback when save button is clicked
	onSave?: (data: any) => void;

	//Callback when delete button is clicked
	onDelete?: (data: any) => void;

	//Data passed from children
	data?: any;

	initialData?: {
		autoIam?: boolean;
		name?: string;
	};
}
interface IState {
	resources: number;
	name: string;
	autoIam: boolean;
}
export default abstract class Resource<Props> extends React.Component<
	IProps & Props & randomIdSettings,
	IState
> {
	constructor(props: IProps & Props & randomIdSettings) {
		super(props);
		this.state = {
			resources: 1,
			name: "",
			autoIam: this.props.initialData?.autoIam ?? true
		};
		this.getData = this.getData.bind(this);
		this.getResourceData = this.getResourceData.bind(this);
	}

	componentDidUpdate(prevProps: IProps & Props, prevState: IState) {
		//Fire onChange if required
		if (
			this.props.onChange &&
			!equal(this.getData(), {
				...prevProps.data,
				resources: prevState.resources,
				name: prevState.name
			})
		) {
			this.props.onChange(this.getData());
		}
	}

	getResourceData() {
		return {
			resources: this.state.resources,
			name: this.state.name,
			autoIam: this.state.autoIam
		};
	}

	getData() {
		return {
			...this.props.data,
			...this.getResourceData()
		};
	}

	defaultProps: {
		resource: "Resource";
		isModifying: false;
		data: {};
	};

	render() {
		return (
			<Grid container direction="column">
				<LabelledCheckboxInput
					initial={this.props.initialData?.autoIam ?? true}
					text="Enable IAM Users"
					description="Determine if IAM Users will be setup for this resource"
					onChange={(autoIam: boolean) => this.setState({autoIam})}
				/>
				<Box textAlign="center">
					<Grid>
						<LabelledTextInputWithRandom
							text={`${this.props.resource} Name`}
							description={`Give this ${this.props.resource} a specific name`}
							{...this.props}
							onChange={(name: string) => {
								this.setState({name});
							}}
							initial={this.props.initialData?.name}
						/>
						<LabelledNumberInput
							text={`Number of ${this.props.resource}s`}
							description={
								<div>
									<p>
										Allows you to spin up any number of
										{this.props.resource.toLowerCase()}s
										with the same settings chosen above
									</p>
									<p>
										They will be named consecutively with
										-a, -b, -c... etc. appended to the name
										you entered
									</p>
								</div>
							}
							initial={1}
							onChange={(resources: number) => {
								this.setState({resources});
							}}
						/>
					</Grid>
				</Box>
				<Box textAlign="center" sx={{paddingTop: 3}}>
					<Grid>
						<Button
							variant="contained"
							color="success"
							size="large"
							startIcon={<CheckIcon />}
							aria-label="add changes"
							onClick={() => {
								if (this.props.onSave) {
									this.props.onSave(this.getData());
								}
							}}>
							{this.props.isModifying
								? `Add ${this.props.resource} Changes`
								: `Add ${this.props.resource}${
										this.state.resources > 1 ? "s" : ""
								  }`}
						</Button>
						{this.props.isModifying && (
							<Button
								sx={{marginLeft: 3}}
								variant="contained"
								color="error"
								size="large"
								aria-label="delete"
								onClick={() => {
									if (this.props.onDelete) {
										this.props.onDelete(this.getData());
									}
								}}>
								{"Delete"}
							</Button>
						)}
					</Grid>
				</Box>
			</Grid>
		);
	}
}
