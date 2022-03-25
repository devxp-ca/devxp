import {Autocomplete, Grid, TextField} from "@mui/material";
import axios from "axios";
import React from "react";
import LabelledCheckboxInput from "../labelledInputs/LabelledCheckboxInput";
import LabelledMultiInput from "../labelledInputs/LabelledMultiSelect";
import LabelledTextInput from "../labelledInputs/LabelledTextInput";
import Resource, {ResourceState} from "./Resource";
import {CONFIG} from "../../config";

const extToKey = (ext?: string) => {
	if (!ext || ext.length < 1) {
		return undefined;
	}

	if (ext === "js") {
		return "nodejs14.x";
	}
	if (ext === "java") {
		return "java8";
	}
	if (ext === "py") {
		return "python3.9";
	}
	if (ext === "go") {
		return "go1.x";
	}
	if (ext === "rb") {
		return "ruby2.7";
	}
	return undefined;
};

interface IProps {
	runtime?: string;
	handler?: string;
	filename?: string;
	keepWarm?: boolean;
	repo?: string;
}
interface IState extends ResourceState {
	runtime: string;
	handler: string;
	filename: string;
	keepWarm: boolean;
	files: string[];
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
			keepWarm: this.props.keepWarm ?? false,
			files: []
		};
	}

	componentDidMount() {
		axios
			.get(
				`${CONFIG.BACKEND_URL}${
					CONFIG.REPO_FILES_PATH
				}?repo=${encodeURIComponent(this.props.repo ?? "")}`
			)
			.then(resp => {
				this.setState({
					files: (resp.data.files as string[]).filter(file =>
						file.match(/.*\.(js|py|java|go|cs|rb)$/)
					)
				});
			})
			.catch(console.error);
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
						].filter((option: {label: string; key: string}) => {
							const ext =
								this.state.filename.split(".")[
									this.state.filename.split(".").length - 1
								];
							const filt = extToKey(ext);
							return !filt || filt === option.key;
						})}
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

					{this.state.files.length < 1 ? (
						<>
							<LabelledTextInput
								pattern=".*\.(js|py|java|go|cs|rb)$"
								text="Filename"
								description="Absolute path to function source within repo"
								initial={this.state.filename}
								onChange={filename => {
									this.setState({
										filename
									});
									const ext =
										filename.split(".")[
											filename.split(".").length - 1
										];
									const runtime = extToKey(ext);
									if (runtime) {
										this.setState({
											runtime
										});
									}
								}}
							/>
						</>
					) : (
						<>
							<Autocomplete
								freeSolo={true}
								sx={{ml: 1, width: "300px"}}
								disableClearable={true}
								options={this.state.files}
								renderInput={(params: any) => (
									<TextField
										{...params}
										label="Filename"
										variant="outlined"
									/>
								)}
								onChange={(_event: any, filename: string) => {
									this.setState({
										filename
									});
									const ext =
										filename.split(".")[
											filename.split(".").length - 1
										];
									const runtime = extToKey(ext);
									console.dir(filename);
									console.dir(ext);
									console.dir(runtime);
									if (runtime) {
										this.setState({
											runtime
										});
									}
								}}
							/>
						</>
					)}

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
