import {Box, Button, Card, Grid, Theme} from "@mui/material";
import React from "react";
import {randomIdSettings} from "../../util";
import LabelledNumberInput from "../labelledInputs/LabelledNumberInput";
import LabelledTextInputWithRandom from "../labelledInputs/LabelledTextInputWithRandom";
import CheckIcon from "@mui/icons-material/Check";
import equal from "deep-equal";
import LabelledCheckboxInput from "../labelledInputs/LabelledCheckboxInput";
import {lightTheme} from "../../style/themes";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {CardActionArea} from "@mui/material";

const display = (content: any): string => {
	if (Array.isArray(content)) {
		if (content.length > 0) {
			return `[${display(content[0]).slice(0, 10)}...]`;
		} else {
			return `[]`;
		}
	} else {
		if (typeof content === "object") {
			return JSON.stringify(content);
		} else {
			return `${content}`;
		}
	}
};

interface IProps {
	//Ec2, S3, etc
	resource?: string;

	//Type to send to backend
	resourceType?: string;

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

	disableIam?: boolean;

	autoIam?: boolean;
	id?: string;

	repo?: string;
}
export interface ResourceState {
	resources: number;
	id: string;
	autoIam: boolean;
	valid: boolean;
	triedToSave: boolean;
}
export default abstract class Resource<
	Props,
	State extends ResourceState
> extends React.Component<IProps & Props & randomIdSettings, State> {
	constructor(props: IProps & Props & randomIdSettings) {
		super(props);
		this.state = {
			resources: 1,
			id: "",
			autoIam: this.props.autoIam ?? true,
			valid: true,
			triedToSave: false
		} as State;
		this.getData = this.getData.bind(this);
		this.getResourceData = this.getResourceData.bind(this);
		this.getInternalData = this.getInternalData.bind(this);
		this.isValid = this.isValid.bind(this);
	}

	componentDidUpdate(_prevProps: IProps & Props, prevState: State) {
		//Fire onChange if required
		if (!equal(this.getData(this.state), this.getData(prevState))) {
			if (this.props.onChange && this.isValid()) {
				this.props.onChange(this.getData());
			}
			if (this.state.triedToSave && !this.state.valid && this.isValid()) {
				this.setState({
					valid: true,
					triedToSave: false
				});
			}
		}
	}

	getResourceData(state: State = this.state) {
		return {
			resources: state.resources,
			id: state.id,
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
			...this.getResourceData(state),
			type: this.props.resourceType
		};
	}

	isValid() {
		const data: Record<string, any> = this.getData();
		return Object.keys(data).reduce(
			(acc, key) =>
				acc &&
				(typeof data[key] === "boolean" || !!data[key]) &&
				(typeof data[key] !== "string" || data[key].length > 0),
			true
		);
	}

	static defaultProps = {
		resource: "Resource",
		isModifying: false,
		data: [] as string[],
		namePattern: "^[a-zA-Z-]+$",
		disableIam: false
	};

	toCard(onClick: () => void, cardSize: number) {
		return (
			<Card
				sx={{
					width: cardSize,
					height: cardSize,
					backgroundColor: "secondary.light"
				}}>
				<CardActionArea
					onClick={onClick}
					sx={{
						height: "100%",
						"&:hover": {
							backgroundColor: "info.light"
						}
					}}>
					<CardMedia sx={{height: "100%"}}>
						<Typography
							gutterBottom
							variant="h5"
							component="div"
							color="black"
							sx={{
								backgroundColor: "info.main",
								borderRadius: 1,
								padding: 2,
								textAlign: "center",
								boxSizing: "border-box"
							}}>
							{this.props.id}
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							component="div"
							sx={{padding: 2, paddingTop: 0}}>
							<div>
								<p>Resource: {this.props.resourceType}</p>
							</div>
							<div>
								<p>AutoIam: {String(this.props.autoIam)}</p>
							</div>
							{this.props.data.slice(0, 2).map((key, i) => (
								<div key={`resourceCard-${this.props.id}-${i}`}>
									<p>
										{key.slice(0, 1).toUpperCase()}
										{key.slice(1).toLowerCase()}:{" "}
										{display(
											(this.state as unknown as any)[key]
										)}
									</p>
								</div>
							))}
						</Typography>
					</CardMedia>
				</CardActionArea>
			</Card>
		);
	}

	render() {
		return (
			<Grid
				container
				direction="column"
				alignItems="center"
				sx={{
					gridGap: "15px",
					marginTop: "15px"
				}}>
				<Grid item>
					<LabelledCheckboxInput
						disabled={this.props.disableIam}
						initial={this.props?.autoIam ?? true}
						text="Enable IAM Users"
						description="Determine if IAM Users will be setup for this resource"
						onChange={(autoIam: boolean) =>
							this.setState({autoIam})
						}
					/>
				</Grid>
				<Box
					textAlign="center"
					sx={{
						display: "flex",
						width: "80vw",
						alignItems: "center",
						justifyContent: "space-evenly",
						flexDirection: "row",
						"& > div": {
							width: "30%"
						}
					}}>
					<LabelledTextInputWithRandom
						text={`${this.props.resource} Name`}
						description={`Give this ${this.props.resource} a specific id`}
						{...this.props}
						onChange={(id: string) => {
							this.setState({id});
						}}
						pattern={this.props.namePattern}
						initial={this.props?.id}
					/>
					<LabelledNumberInput
						text={`Number of ${this.props.resource}s`}
						description={
							<div>
								<p>
									Allows you to spin up any number of
									{this.props.resource.toLowerCase()}s with
									the same settings chosen above
								</p>
								<p>
									They will be named consecutively with -a,
									-b, -c... etc. appended to the name you
									entered
								</p>
							</div>
						}
						initial={1}
						onChange={(resources: number) => {
							this.setState({resources});
						}}
					/>
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
								const valid = this.isValid();
								if (valid && this.props.onSave) {
									this.props.onSave(this.getData());
								}
								this.setState({valid, triedToSave: true});
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
