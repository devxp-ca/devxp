import React from "react";
import Resource, {ResourceState} from "./Resource";

interface IProps {}
interface IState extends ResourceState {}
export default class Glacier extends Resource<IProps, IState> {
	static defaultProps = {
		...Resource.defaultProps,

		//Type of resource for labels
		resource: "Glacier",

		//For autogenerated random IDs
		randomPrefix: "Glacier-",

		//Length of random hash
		randomGroups: 5,

		//The "type" to send to the backend
		resourceType: "glacierVault"
	};

	render() {
		return super.render();
	}
}
