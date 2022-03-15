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
	data?: string[];

	namePattern?: string;

	initialData?: {
		autoIam?: boolean;
		name?: string;
	};
}
export interface ResourceState {
	resources: number;
	name: string;
	autoIam: boolean;
	valid: boolean;
}
export default abstract class Resource<
	Props,
	State extends ResourceState
> extends React.Component<IProps & Props & randomIdSettings, State> {
	constructor(props: IProps & Props & randomIdSettings) {
		super(props);
		this.state = {
			resources: 1,
			name: "",
			autoIam: this.props.initialData?.autoIam ?? true,
			valid: true
		} as State;
		this.getData = this.getData.bind(this);
		this.getResourceData = this.getResourceData.bind(this);
		this.getInternalData = this.getInternalData.bind(this);
		this.isValid = this.isValid.bind(this);
	}

	componentDidUpdate(_prevProps: IProps & Props, prevState: State) {
		//Fire onChange if required
		if (
			this.props.onChange &&
			!equal(this.getData(this.state), this.getData(prevState))
		) {
			if (this.isValid()) {
				this.props.onChange(this.getData());
			}
			this.setState({
				valid: this.isValid()
			});
		}
	}

	getResourceData(state: State = this.state) {
		return {
			resources: state.resources,
			name: state.name,
			autoIam: state.autoIam
		};
	}

	//This is really hacky, don't do this at home kids
	getInternalData(state: Record<string, any> = this.state) {
		const data: Record<string, any> = {};
		this.props.data.forEach(key => {
			if (key in state) {
				data[key] = state[key];
			}
		});
		return data;
	}

	getData(state: State = this.state) {
		return {
			...this.getInternalData(state),
			...this.getResourceData(state)
		};
	}

	isValid() {
		const data: Record<string, any> = this.getData();
		return Object.keys(data).reduce(
			(acc, key) =>
				acc &&
				!!data[key] &&
				(typeof data[key] !== "string" || data[key].length > 0),
			true
		);
	}

	static defaultProps = {
		resource: "Resource",
		isModifying: false,
		data: [] as string[],
		namePattern: "^[a-zA-Z-]+$"
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
							pattern={this.props.namePattern}
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
							disabled={!this.state.valid}
							variant="contained"
							color={this.state.valid ? "success" : "warning"}
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
