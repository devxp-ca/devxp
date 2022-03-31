import {
	Box,
	Button,
	Card,
	Grid,
	Typography,
	CardMedia,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	CardActionArea
} from "@mui/material";
import React from "react";
import {getRandomId, randomIdSettings} from "../../util";
import LabelledNumberInput from "../labelledInputs/LabelledNumberInput";
import LabelledTextInputWithRandom from "../labelledInputs/LabelledTextInputWithRandom";
import CheckIcon from "@mui/icons-material/Check";
import equal from "deep-equal";
import LabelledCheckboxInput from "../labelledInputs/LabelledCheckboxInput";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import valueToLabel from "./valueToLabel";

const display = (content: any): string => {
	if (Array.isArray(content)) {
		// if (content.length > 0) {
		// 	return `[${display(content[0]).slice(0, 10)}...]`;
		// } else {
		// 	return `[]`;
		// }
		return `[${content.length} item${
			content.length > 1 || content.length === 0 ? "s" : ""
		}]`;
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
		this.populateDefault = this.populateDefault.bind(this);
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

	populateDefault() {
		this.state = {
			...this.state,
			id: getRandomId({...this.props})
		};
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
								borderRadius: "2px 2px 0px 0px",
								padding: 2,
								textAlign: "center",
								boxSizing: "border-box"
							}}>
							{this.props.resource}
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							component="div"
							sx={{padding: 2, paddingTop: 0}}>
							<div>
								<p>ID: {this.props.id}</p>
							</div>
							{this.props.data.slice(0, 2).map((key, i) => (
								<div key={`resourceCard-${this.props.id}-${i}`}>
									<p>
										{valueToLabel(key)}:{" "}
										{valueToLabel(
											display(
												(this.state as unknown as any)[
													key
												]
											)
										)}
									</p>
								</div>
							))}
							<div>
								<p>AutoIam: {String(this.props.autoIam)}</p>
							</div>
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
				sx={{
					gridGap: "15px",
					marginTop: "15px"
				}}>
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
						text={`${this.props.resource} ID`}
						description={
							<div>
								<p>
									Checking the box allows you to give this{" "}
									{this.props.resource} a specific ID.
									Otherwise a randomly generated ID will be
									used in its place.
								</p>
								<a
									href="https://github.com/devxp-ca/devxp/wiki/Tool-Manager-Configuration#resource-id"
									target="_blank">
									Learn about the rules for IDs and storage
									resource naming rules.
								</a>
							</div>
						}
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
									Allows you to spin up any number of{" "}
									{this.props.resource.toLowerCase()}s with
									the same settings you have chosen here.
								</p>
								<p>
									The resources will be named consecutively
									with -a, -b, -c... etc. appended to the name
									you have entered.
								</p>
							</div>
						}
						initial={1}
						onChange={(resources: number) => {
							this.setState({resources});
						}}
					/>
				</Box>
				<Accordion disableGutters={true}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						id="resource-config-advanced-settings">
						<Typography>Advanced Settings</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid
							item
							container
							direction="column"
							alignItems="center"
							sx={{
								width: "100%"
							}}>
							<Grid
								item
								sx={{
									paddingLeft: 2
								}}>
								<LabelledCheckboxInput
									disabled={this.props.disableIam}
									initial={this.props?.autoIam ?? true}
									text="Create IAM User"
									description={
										<div>
											<p>
												Creates an{" "}
												<a
													href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html"
													target="_blank">
													IAM user
												</a>{" "}
												with permissions for the
												resource in question.
											</p>
											<p>
												To access/modify this resource
												programmatically, through code,
												or from another resource, you
												must use an IAM user.
											</p>
											<a
												href="https://github.com/devxp-ca/devxp/wiki/Tool-Manager-Configuration#create-iam-user-advanced"
												target="_blank">
												Learn more.
											</a>
										</div>
									}
									onChange={(autoIam: boolean) =>
										this.setState({autoIam})
									}
								/>
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
				<Box textAlign="center" sx={{paddingTop: 3, width: "100%"}}>
					<Grid>
						<Button
							sx={{
								":hover": {
									bgcolor: this.state.valid
										? "success.main"
										: "warning.main",
									opacity: 0.9
								}
							}}
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
								sx={{
									marginLeft: 3,
									":hover": {
										bgcolor: "error",
										opacity: 0.9
									}
								}}
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
				<Button
					size="small"
					variant="text"
					onClick={() => {
						window.open(
							"https://github.com/devxp-ca/devxp/wiki/Tool-Manager-Configuration#terraform-resource-configuration"
						);
					}}>
					How to configure this resource.
				</Button>
			</Grid>
		);
	}
}
