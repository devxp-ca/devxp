import React from "react";
import LabelledMultiInput from "../labelledInputs/LabelledMultiSelect";
import LabelledRadioInput from "../labelledInputs/LabelledRadioSelect";
import Resource, {ResourceState} from "./Resource";

interface IProps {
	ami?: string;
	instance?: string;
}
interface IState extends ResourceState {
	ami: string;
	instance: string;
}
export default class Ec2 extends Resource<IProps, IState> {
	static defaultProps = {
		...Resource.defaultProps,
		//Keys of IState, hacky I know
		data: ["ami", "instance"],
		resource: "Instance",
		randomPrefix: "ecTwo-"
	};

	constructor(props: IProps) {
		super(props);

		//Lmao this is so bad practice
		this.state = {
			...this.state,
			ami: this.props.ami ?? "",
			instance: this.props.instance ?? ""
		};
	}

	render() {
		return (
			<>
				<LabelledMultiInput
					text="Instance OS"
					description="Choose the type of OS you want this instance to run"
					options={[
						{
							label: "Ubuntu Server 20.04 LTS 64-bit x86",
							key: "AUTO_UBUNTU"
						},
						{label: "Amazon Linux 2 AMI (HVM)", key: "AUTO_AMAZON"},
						{
							label: "MacOS Monterey 12.2",
							key: "ami-0faefa03f7ddcd657"
						},
						{
							label: "Microsoft Windows Server 2022",
							key: "AUTO_WINDOWS"
						}
					]}
					onChange={ami => this.setState({ami})}
				/>

				<LabelledRadioInput
					text="Instance Hardware"
					description={
						<div>
							<p>
								Choose the computing power you want this
								instance to have:
							</p>
							<p>Micro - 1 CPU 1GB RAM</p>
							<p>Small - 1 CPU 2GB RAM</p>
							<p>Medium - 2 CPU 4GB RAM</p>
							<p>Large - 2 CPU 8GB RAM</p>
							<p>Extra-Large - 4 CPU 16GB RAM</p>
						</div>
					}
					options={
						this.state.ami === "ami-0faefa03f7ddcd657"
							? [{label: "MAC Hardware", key: "mac1.metal"}]
							: [
									{label: "Micro", key: "t2.micro"},
									{label: "Small", key: "t2.small"},
									{label: "Medium", key: "t2.medium"},
									{label: "Large", key: "t2.large"},
									{label: "Extra Large", key: "t2.xlarge"},
									{
										label: "Compute Opmized",
										key: "c3.2xlarge"
									},
									{
										label: "Compute Optimized Extra Large",
										key: "c3.8xlarge"
									},
									{
										label: "Storage Optimized",
										key: "d3.2xlarge"
									},
									{
										label: "Storage Optimized Extra Large",
										key: "d3.8xlarge"
									},
									{
										label: "Memory Optimized",
										key: "r3.2xlarge"
									},
									{
										label: "Memory Optimized Extra Large",
										key: "r3.8xlarge"
									}
							  ]
					}
					onChange={instance => this.setState({instance})}
				/>

				{super.render()}
			</>
		);
	}
}
