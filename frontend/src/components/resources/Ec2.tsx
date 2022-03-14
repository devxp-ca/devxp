import React from "react";
import Resource from "./Resource";

interface IProps {}
interface IState {}
export default class Ec2 extends Resource<IProps> {
	constructor(props: IProps) {
		super({
			...props,
			resource: "Instance",
			randomPrefix: "ecTwo-",
			randomGroups: 1
		});
	}

	render() {
		return <>{super.render()}</>;
	}
}
