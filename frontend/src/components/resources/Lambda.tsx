import {Grid} from "@mui/material";
import React from "react";
import LabelledCheckboxInput from "../labelledInputs/LabelledCheckboxInput";
import LabelledMultiInput from "../labelledInputs/LabelledMultiSelect";
import LabelledTextInput from "../labelledInputs/LabelledTextInput";
import Resource, {ResourceState} from "./Resource";

interface IProps {
	runtime?: string;
	handler?: string;
	filename?: string;
	keepWarm?: boolean;
}
interface IState extends ResourceState {
	runtime: string;
	handler: string;
	filename: string;
	keepWarm: boolean;
}
export default class Lambda extends Resource<IProps, IState> {
	static defaultProps = {
		...Resource.defaultProps,

		//Type of resource for labels
		resource: "Function",

		//Keys of IState, hacky I know
		data: ["runtime", "handler", "filename", "keepWarm"],

		//For autogenerated random IDs
		randomPrefix: "Lambda-",

		//The "type" to send to the backend
		resourceType: "lambdaFunc"
	};

	constructor(props: IProps) {
		super(props);

		//Lmao this is so bad practice
		this.state = {
			...this.state,
			runtime: this.props.runtime ?? "",
			handler: this.props.handler ?? "",
			filename: this.props.filename ?? "",
			keepWarm: this.props.keepWarm ?? false
		};
	}

	render() {
		return (
			<Grid
				sx={{
					padding: "5px",
					gridGap: "15px",
					display: "flex",
					flexDirection: "column",
					...(this.state.valid
						? {}
						: {
								border: "2px solid red",
								borderRadius: "10px"
						  })
				}}>
				<Grid
					sx={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-evenly",
						"& > div": {
							width: "100%"
						},
						"& > div:nth-of-type(2)": {
							marginTop: "32px"
						}
					}}>
					<LabelledMultiInput
						text="Runtime"
						description="Choose the type of runtime you want this function to use"
						options={[
							{
								label: "NodeJS 14",
								key: "nodejs14.x"
							},
							{
								label: "Java 8",
								key: "java8"
							},
							{
								label: "Python 3.9",
								key: "python3.9"
							},
							{
								label: "GO",
								key: "go1.x"
							},
							{
								label: "Ruby 2.7",
								key: "ruby2.7"
							},
							{
								label: ".NET Core 3.1",
								key: "dotnetcore3.1"
							}
						]}
						onChange={runtime => this.setState({runtime})}
						initial={this.state.runtime}
					/>

					<LabelledCheckboxInput
						initial={this.state.keepWarm}
						text="Keep Warm"
						description="Automatically trigger lambda function every one minute"
						onChange={(keepWarm: boolean) =>
							this.setState({keepWarm})
						}
					/>
					<LabelledTextInput
						pattern=".*\.(js|py|java|go|cs|rb)$"
						text="Filename"
						description="Absolute path to function source within repo"
						initial={this.state.filename}
						onChange={filename => {
							this.setState({
								filename
							});
						}}
					/>

					<LabelledTextInput
						pattern="..*"
						text="Exported Handler"
						description="Exported function (within source file) to invoke"
						initial={this.state.handler}
						onChange={handler => {
							this.setState({
								handler
							});
						}}
					/>
				</Grid>
				{super.render()}
			</Grid>
		);
	}
}
