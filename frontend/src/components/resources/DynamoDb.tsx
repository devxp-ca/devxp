import Grid from "@mui/material/Grid";
import React from "react";
import LabelledMultiSelect from "../labelledInputs/LabelledMultiSelect";
import LabelledTextInput from "../labelledInputs/LabelledTextInput";
import Resource, {ResourceState} from "./Resource";
import {Typography} from "@mui/material";
import Button from "@mui/material/Button";

interface Attribute {
	name: string;
	type: "S" | "B" | "N";
	isHash: boolean;
}

interface IProps {
	attributes?: Attribute[];
}
interface IState extends ResourceState {
	attributes: Attribute[];
}
export default class DynamoDb extends Resource<IProps, IState> {
	static defaultProps = {
		...Resource.defaultProps,

		//Type of resource for labels
		resource: "DynamoDb",

		//For autogenerated random IDs
		randomPrefix: "DynamoDb-",

		data: ["attributes"],

		//The "type" to send to the backend
		resourceType: "dynamoDb"
	};

	constructor(props: IProps) {
		super(props);

		this.state = {
			...this.state,
			attributes: this.props.attributes ?? []
		};
	}

	isValid() {
		return (
			super.isValid() &&
			this.state.attributes.reduce(
				(acc, cur, i, arr) =>
					cur.name.length > 0 &&
					cur.type.length > 0 &&
					acc &&
					(i === 0 || cur.name !== arr[i - 1].name),
				this.state.attributes.length > 0
			)
		);
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
				{this.state.attributes.length > 0 ? (
					this.state.attributes.map((att, i) => (
						<Grid
							key={`dynamoDb-${this.state.id}-${i}`}
							sx={{
								"& > div": {
									width: "30%"
								}
							}}
							container
							direction="row">
							<LabelledTextInput
								direction="row"
								text="Name"
								description="A name to identify this DB attribute with"
								initial={att.name}
								pattern="^[a-zA-Z]+$"
								onChange={name => {
									this.setState({
										attributes: this.state.attributes.map(
											(attr: Attribute, j) => {
												if (i === j) {
													attr = {
														name,
														type: attr.type,
														isHash: true //TODO: Add more booleans
													};
												}
												return attr;
											}
										)
									});
								}}
							/>
							<LabelledMultiSelect
								formStyle={true}
								text="Type"
								description="String, Number, or Binary"
								initial={att.type}
								options={[
									{key: "S", label: "String"},
									{key: "N", label: "Number"},
									{key: "B", label: "Binary"}
								]}
								onChange={(type: "B" | "N" | "S") => {
									this.setState({
										attributes: this.state.attributes.map(
											(attr: Attribute, jj) => {
												if (i === jj) {
													attr = {
														name: attr.name,
														type,
														isHash: true //TODO: Add more booleans
													};
												}
												return attr;
											}
										)
									});
								}}
							/>
							<Button
								variant="contained"
								color="error"
								onClick={() => {
									console.dir(i);
									this.setState({
										attributes:
											this.state.attributes.filter(
												(_attr, ii) => i !== ii
											)
									});
								}}>
								Delete
							</Button>
						</Grid>
					))
				) : (
					<Typography>No Attributes Selected</Typography>
				)}
				<Button
					variant="contained"
					color="success"
					onClick={() => {
						this.setState({
							attributes: [
								...this.state.attributes,
								{name: "", type: "S", isHash: true}
							]
						});
					}}>
					Add Attribute
				</Button>
				{super.render()}
			</Grid>
		);
	}
}
