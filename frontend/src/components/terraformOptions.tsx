import React from "react";
import Button from "@mui/material/Button";
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
import HelpIcon from "@mui/icons-material/Help";
import Checkbox from "@mui/material/Checkbox";

import MouseOverPopover from "./MouseOverPopover";

/* TODO: Add google fields, uncomment + add dynamoDB fields, implement lambda function fields */
export interface terraformDataSettings {
	repo: string;
	tool: string;
	settings: {
		provider: string;
		secure: boolean;
		resources: {
			type: string;
			id: string;
			autoIam: boolean;
			ami: string; // for ec2
			instance_type: string; // for ec2
			attributes: {
				//for dynamodb
				name: string;
				type: string; //"S" for string, "N" for number, or "B" for binary
				isHash: boolean; //For now just always set this true. Support for other types of keys hasn't been added yet
			}[];
			//for lambdafunctions
			functionName: string; // must match the regex /^[a-zA-Z][a-zA-Z0-9_]+$/ or /^([a-zA-Z0-9_\\.]+|[a-zA-Z0-9_/.]+)[a-zA-Z0-9_]+\.zip$/
			runtime: string; //values can be found in backend/src/types/terraform.ts
		}[];
	};
}

export default function TerraformOptions(props: {
	selectedRepo: string;
	instanceDataForModify?: terraformDataSettings; //used when modifying existing instances
	globalProvider: string;
	globalSecure: boolean;
	addNewDataCallback: (
		newData: terraformDataSettings,
		isModifyingInstance: Boolean,
		cardNum: number
	) => void;
	cardIndex: number;
}) {
	const isModifyingInstance = Boolean(props.instanceDataForModify);

	const resource0 = props.instanceDataForModify.settings.resources[0];

	//OPTION STATES AND REDUCER -- pre-populate options if modifying
	const initialOptionState = {
		providerValue: isModifyingInstance
			? props.instanceDataForModify.settings.provider ??
			  props.globalProvider
			: props.globalProvider,
		secureValue: isModifyingInstance
			? props.instanceDataForModify.settings.secure ?? props.globalSecure
			: props.globalSecure,
		resourceTypeValue: isModifyingInstance ? resource0.type ?? "" : "",
		instanceNameValue: isModifyingInstance ? resource0.id ?? "" : "",
		autoIamValue: isModifyingInstance ? resource0.autoIam ?? false : false,
		amiValue: isModifyingInstance ? resource0.ami ?? "" : "",
		instanceTypeValue: isModifyingInstance
			? resource0.instance_type ?? ""
			: "",
		functionNameValue: isModifyingInstance
			? resource0.functionName ?? ""
			: "",
		runtimeValue: isModifyingInstance ? resource0.runtime ?? "" : "",
		numberOfInstancesValue: 1,
		//TODO: Figure out UI design and way to configure multiple database attributes -- this allows only 1 attribute
		attributeName: isModifyingInstance
			? ("attributes" in resource0 && resource0.attributes[0].name) ?? ""
			: "",
		attributeType: isModifyingInstance
			? ("attributes" in resource0 && resource0.attributes[0].type) ?? ""
			: "",
		attributeIsHash: isModifyingInstance
			? ("attributes" in resource0 && resource0.attributes[0].isHash) ??
			  false
			: false
	};

	const [optionState, dispatch] = React.useReducer(
		optionsReducer,
		initialOptionState
	);

	const {
		providerValue,
		secureValue,
		resourceTypeValue,
		instanceNameValue,
		autoIamValue,
		amiValue,
		instanceTypeValue,
		functionNameValue,
		runtimeValue,
		numberOfInstancesValue,
		//TODO: Figure out UI design and way to configure multiple database attributes -- this allows only 1 attribute
		attributeNameValue,
		attributeTypeValue,
		attributeIsHashValue
	} = optionState;

	function optionsReducer(state: any, action: any) {
		switch (action.type) {
			case "provider":
				return {
					...state,
					providerValue: action.payload
				};
			case "resourceType":
				return {
					...state,
					resourceTypeValue: action.payload
				};
			case "instanceName":
				return {
					...state,
					instanceNameValue: action.payload
				};
			case "autoIam":
				return {
					...state,
					autoIamValue: action.payload
				};
			case "ami":
				return {
					...state,
					amiValue: action.payload
				};
			case "instanceType":
				return {
					...state,
					instanceTypeValue: action.payload
				};
			case "functionName":
				return {
					...state,
					functionNameValue: action.payload
				};
			case "runtime":
				return {
					...state,
					runtimeValue: action.payload
				};
			case "numberOfInstances":
				return {
					...state,
					numberOfInstancesValue: action.payload
				};
			//TODO: Figure out UI design and way to configure multiple database attributes -- this allows only 1 attribute
			case "attributeName":
				return {
					...state,
					attributeNameValue: action.payload
				};
			case "attributeType":
				return {
					...state,
					attributeTypeValue: action.payload
				};
			case "attributeIsHash":
				return {
					...state,
					attributeIsHashValue: action.payload
				};
			default:
				return state;
		}
	}

	const addChanges = () => {
		let resourceArray = [];
		for (let i = 0; i < numberOfInstancesValue; i++) {
			resourceArray.push({
				type: resourceTypeValue,
				id:
					i == 0
						? instanceNameValue
						: `${instanceNameValue}-${String.fromCharCode(96 + i)}`,
				autoIam: autoIamValue,
				ami: amiValue,
				instance_type: instanceTypeValue,
				//TODO: Figure out UI design and way to configure multiple database attributes -- this allows only 1 attribute
				attributes: [
					{
						name: attributeNameValue,
						type: attributeTypeValue,
						isHash: attributeIsHashValue
					}
				],
				functionName: functionNameValue,
				runtime: runtimeValue
			});
		}
		const settings: terraformDataSettings = {
			repo: props.selectedRepo,
			tool: "terraform",
			settings: {
				provider: providerValue,
				secure: secureValue,
				resources: resourceArray
			}
		};
		props.addNewDataCallback(
			settings,
			isModifyingInstance,
			props.cardIndex
		);
	};

	const deleteInstance = () => {
		props.addNewDataCallback(null, isModifyingInstance, props.cardIndex);
	};

	return (
		<Box sx={{padding: 4}}>
			<Grid container direction="column">
				{
					//AWS Options
					providerValue === "aws" && (
						<Grid container direction="column">
							<Grid container direction="row">
								<FormControl>
									<FormLabel>
										<Grid container direction="row">
											Resource Type
											<MouseOverPopover
												icon={
													<HelpIcon
														sx={{
															paddingLeft: 1
														}}
													/>
												}
												popOverInfo={
													<div>
														Choose the type of
														resource that you want
														terraform to spin up
													</div>
												}
											/>
										</Grid>
									</FormLabel>
									<RadioGroup
										name="resource-type"
										value={resourceTypeValue}
										onChange={(
											event: React.ChangeEvent<HTMLInputElement>
										) =>
											dispatch({
												type: "resourceType",
												payload: (
													event.target as HTMLInputElement
												).value
											})
										}
										row>
										<FormControlLabel
											key="1"
											value="ec2"
											control={<Radio size="medium" />}
											label="EC2"
										/>
										<FormControlLabel
											key="2"
											value="s3"
											control={<Radio size="medium" />}
											label="S3"
										/>
										<FormControlLabel
											key="3"
											value="glacierVault"
											control={<Radio size="medium" />}
											label="glacierVault"
										/>
										<FormControlLabel
											key="4"
											value="dynamoDb"
											control={<Radio size="medium" />}
											label="dynamoDb"
										/>
										<FormControlLabel
											key="5"
											value="lambdaFunction"
											control={<Radio size="medium" />}
											label="lambdaFunction"
											disabled={true}
										/>
									</RadioGroup>
								</FormControl>
							</Grid>

							{/* ------ AWS - EC2 OPTIONS ------ */}
							{optionState.resourceTypeValue === "ec2" && (
								<Grid
									container
									direction="column"
									alignItems="center">
									<Grid item sx={{paddingTop: 2}}>
										<FormControl>
											<FormLabel>
												<Grid container direction="row">
													Instance OS
													<MouseOverPopover
														icon={
															<HelpIcon
																sx={{
																	paddingLeft: 1
																}}
															/>
														}
														popOverInfo={
															<div>
																Choose the type
																of OS you want
																this instance to
																run
															</div>
														}
													/>
												</Grid>
											</FormLabel>
											<Select
												name="instance-os"
												value={amiValue}
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) =>
													dispatch({
														type: "ami",
														payload: (
															event.target as HTMLInputElement
														).value
													})
												}>
												<MenuItem
													key="amazon-linux"
													value="AUTO_AMAZON">
													Amazon Linux 2 AMI (HVM)
												</MenuItem>
												<MenuItem
													key="ubuntu"
													value="AUTO_UBUNTU">
													Ubuntu Server 20.04 LTS
													64-bit x86
												</MenuItem>
												<MenuItem
													key="macOS"
													value="ami-0faefa03f7ddcd657">
													MacOS Monterey 12.2
												</MenuItem>
												<MenuItem
													key="windows"
													value="AUTO_WINDOWS">
													Microsoft Windows Server
													2022 Base with Containers
												</MenuItem>
											</Select>
										</FormControl>
									</Grid>
									<Grid item sx={{paddingTop: 2}}>
										<FormControl>
											<FormLabel>
												<Grid container direction="row">
													Instance Hardware
													<MouseOverPopover
														icon={
															<HelpIcon
																sx={{
																	paddingLeft: 1
																}}
															/>
														}
														popOverInfo={
															<div>
																<p>
																	Choose the
																	computing
																	power you
																	want this
																	instance to
																	have:
																</p>
																<p>
																	Micro - 1
																	CPU 1GB RAM
																</p>
																<p>
																	Small - 1
																	CPU 2GB RAM
																</p>
																<p>
																	Medium - 2
																	CPU 4GB RAM
																</p>
																<p>
																	Large - 2
																	CPU 8GB RAM
																</p>
																<p>
																	Extra-Large
																	- 4 CPU 16GB
																	RAM
																</p>
															</div>
														}
													/>
												</Grid>
											</FormLabel>
											<RadioGroup
												name="Instance Hardware"
												value={instanceTypeValue}
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) =>
													dispatch({
														type: "instanceType",
														payload: (
															event.target as HTMLInputElement
														).value
													})
												}
												row>
												{optionState.amiValue ===
												"ami-0faefa03f7ddcd657" ? (
													//If the ami image selected is MAC, the instance MUST be mac1.metal
													<>
														<FormControlLabel
															key="1"
															value="mac1.metal"
															control={
																<Radio size="small" />
															}
															label="Mac Hardware"
														/>
													</>
												) : (
													<>
														<FormControlLabel
															key="1"
															value="t2.micro"
															control={
																<Radio size="small" />
															}
															label="Micro"
														/>
														<FormControlLabel
															key="2"
															value="t2.small"
															control={
																<Radio size="small" />
															}
															label="Small"
														/>
														<FormControlLabel
															key="3"
															value="t2.medium"
															control={
																<Radio size="small" />
															}
															label="Medium"
														/>
														<FormControlLabel
															key="4"
															value="t2.large"
															control={
																<Radio size="small" />
															}
															label="Large"
														/>
														<FormControlLabel
															key="5"
															value="t2.xlarge"
															control={
																<Radio size="small" />
															}
															label="Extra-Large"
														/>
													</>
												)}
											</RadioGroup>
										</FormControl>
									</Grid>
								</Grid>
							)}

							{/* ------ AWS - S3 OPTIONS ------ */}
							{}

							{/* ------ AWS - GLACIERVAULT OPTIONS ------ */}
							{}

							{/* ------ AWS - DYNAMODB OPTIONS ------ */}
							{/*TODO: Figure out UI design and way to configure multiple database attributes -- this allows only 1 attribute*/}
							{optionState.resourceTypeValue === "dynamoDb" && (
								<FormControl>
									<Grid
										container
										direction="row"
										alignItems="center"
										sx={{paddingTop: 2}}
										justifyContent="center"
										spacing={2}>
										<Grid item>
											<FormControl>
												<FormLabel>
													<Grid
														container
														direction="row">
														Attribute Name
														<MouseOverPopover
															icon={
																<HelpIcon
																	sx={{
																		paddingLeft: 1
																	}}
																/>
															}
															popOverInfo={
																<div>
																	Give this
																	database
																	attribute a
																	name for
																	identification
																</div>
															}
														/>
													</Grid>
												</FormLabel>
												<TextField
													id="attribute-name"
													name="attribute-name"
													label=""
													type="text"
													value={attributeNameValue}
													onChange={(
														event: React.ChangeEvent<HTMLInputElement>
													) =>
														dispatch({
															type: "attributeName",
															payload: (
																event.target as HTMLInputElement
															).value
														})
													}
												/>
											</FormControl>
										</Grid>
										<Grid item>
											<FormLabel>
												<Grid container direction="row">
													Type
													<MouseOverPopover
														icon={
															<HelpIcon
																sx={{
																	paddingLeft: 1
																}}
															/>
														}
														popOverInfo={
															<div>
																String, Number,
																or Binary for
																the type of
																database
																attribute
															</div>
														}
													/>
												</Grid>
											</FormLabel>
											<Grid item>
												<Select
													name="attribute-type"
													value={attributeTypeValue}
													onChange={(
														event: React.ChangeEvent<HTMLInputElement>
													) =>
														dispatch({
															type: "attributeType",
															payload: (
																event.target as HTMLInputElement
															).value
														})
													}
													sx={{width: 75}}>
													<MenuItem key="S" value="S">
														String
													</MenuItem>
													<MenuItem key="N" value="N">
														Number
													</MenuItem>
													<MenuItem key="B" value="B">
														Binary
													</MenuItem>
												</Select>
											</Grid>
										</Grid>
										<Grid item>
											<FormLabel>
												<Grid container direction="row">
													isHash
													<MouseOverPopover
														icon={
															<HelpIcon
																sx={{
																	paddingLeft: 1
																}}
															/>
														}
														popOverInfo={
															<div>
																Type of key
															</div>
														}
													/>
												</Grid>
											</FormLabel>
											<Checkbox
												sx={{
													"& .MuiSvgIcon-root": {
														fontSize: 32
													},
													marginTop: -1
												}}
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) =>
													dispatch({
														type: "attributeIsHash",
														payload: (
															event.target as HTMLInputElement
														).value
													})
												}
											/>
										</Grid>
									</Grid>
								</FormControl>
							)}

							{/* ------ AWS - LAMBDAFUNCTION OPTIONS ------ */}
							{}

							{/* ------ AWS - GENERAL OPTIONS ------ */}
							<Grid
								container
								alignItems="center"
								justifyContent="center"
								direction="row"
								sx={{paddingTop: 2}}>
								<FormControl>
									<FormLabel>
										<Grid container direction="row">
											Enable IAM Users
											<MouseOverPopover
												icon={
													<HelpIcon
														sx={{
															paddingLeft: 1
														}}
													/>
												}
												popOverInfo={
													<div>
														Determines if IAM users
														will be setup for the
														resource
													</div>
												}
											/>
										</Grid>
									</FormLabel>
									<Checkbox
										sx={{
											"& .MuiSvgIcon-root": {
												fontSize: 32
											},
											marginTop: -1
										}}
										onChange={(
											event: React.ChangeEvent<HTMLInputElement>
										) =>
											dispatch({
												type: "autoIam",
												payload: (
													event.target as HTMLInputElement
												).value
											})
										}
									/>
								</FormControl>
							</Grid>
						</Grid>
					)
				}

				{/* ------ GENERAL OPTIONS ------ */}
				<FormControl>
					<Grid
						container
						direction="row"
						alignItems="center"
						sx={{paddingTop: 2}}
						justifyContent="center"
						spacing={2}>
						<Grid item>
							<FormControl>
								<FormLabel>
									<Grid container direction="row">
										Instance Name
										<MouseOverPopover
											icon={
												<HelpIcon
													sx={{
														paddingLeft: 1
													}}
												/>
											}
											popOverInfo={
												<div>
													Give this particular
													instance a name so it's
													identifiable -- can be
													whatever you like
												</div>
											}
										/>
									</Grid>
								</FormLabel>
								<TextField
									id="instance-name"
									name="instance-name"
									label=""
									type="text"
									value={instanceNameValue}
									onChange={(
										event: React.ChangeEvent<HTMLInputElement>
									) =>
										dispatch({
											type: "instanceName",
											payload: (
												event.target as HTMLInputElement
											).value
										})
									}
								/>
							</FormControl>
						</Grid>
						<Grid item>
							<FormLabel>
								<Grid container direction="row">
									Number of Instances
									<MouseOverPopover
										icon={
											<HelpIcon
												sx={{
													paddingLeft: 1
												}}
											/>
										}
										popOverInfo={
											<div>
												<p>
													Allows you to spin up any
													number of instances with the
													same settings chosen above
												</p>
												<p>
													They will be named
													consecutively with -a, -b,
													-c... etc. appended to the
													name you entered
												</p>
											</div>
										}
									/>
								</Grid>
							</FormLabel>
							<Grid item>
								<TextField
									id="number-of-instances"
									name="number-of-instances"
									label=""
									type="number"
									value={numberOfInstancesValue}
									onChange={(
										event: React.ChangeEvent<HTMLInputElement>
									) =>
										dispatch({
											type: "numberOfInstances",
											payload: (
												event.target as HTMLInputElement
											).value
										})
									}
								/>
							</Grid>
						</Grid>
					</Grid>
				</FormControl>
			</Grid>
			<Box textAlign="center" sx={{paddingTop: 3}}>
				<Grid>
					<Button
						variant="contained"
						color="success"
						size="large"
						startIcon={<CheckIcon />}
						aria-label="add changes"
						onClick={addChanges}>
						{isModifyingInstance
							? "Add Instance Changes"
							: "Add Instance(s)"}
					</Button>
					{isModifyingInstance && (
						<Button
							sx={{marginLeft: 3}}
							variant="contained"
							color="error"
							size="large"
							aria-label="delete"
							onClick={deleteInstance}>
							{"Delete"}
						</Button>
					)}
				</Grid>
			</Box>
		</Box>
	);
}
