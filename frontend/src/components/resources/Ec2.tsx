import React from "react";
import Resource from "./Resource";

interface IProps {
	test: string;
}
interface IState {}
export default class Ec2 extends Resource<IProps, IState> {
	constructor(props: IProps) {
		super(props);
	}

	render() {
		return (
			<>
				<h1>Ec2</h1>
				{super.render()}
				<h1>Ec2</h1>
			</>
		);
	}
}
