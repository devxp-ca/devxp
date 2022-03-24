import React from "react";
import Ec2 from "./Ec2";
import S3 from "./S3";
import Glacier from "./Glacier";
import DynamoDb from "./DynamoDb";
import Gce from "./Gce";
import StorageBucket from "./StorageBucket";
import Resource from "./Resource";
import Lambda from "./Lambda";
import GoogleFunction from "./GoogleFunction";
import CloudRun from "./CloudRun";

export default (
	resource: {
		type: string;
	} & any,
	noRender: boolean = false
) => {
	switch (resource.type) {
		case "ec2":
			return noRender ? (
				new Ec2({
					...Resource.defaultProps,
					...Ec2.defaultProps,
					...resource
				})
			) : (
				<Ec2 {...resource} />
			);
		case "s3":
			return noRender ? (
				new S3({
					...Resource.defaultProps,
					...S3.defaultProps,
					...resource
				})
			) : (
				<S3 {...resource} />
			);
		case "glacierVault":
			return noRender ? (
				new Glacier({
					...Resource.defaultProps,
					...Glacier.defaultProps,
					...resource
				})
			) : (
				<Glacier {...resource} />
			);
		case "dynamoDb":
			return noRender ? (
				new DynamoDb({
					...Resource.defaultProps,
					...DynamoDb.defaultProps,
					...resource
				})
			) : (
				<DynamoDb {...resource} />
			);
		case "lambdaFunc":
			return noRender ? (
				new Lambda({
					...Resource.defaultProps,
					...Lambda.defaultProps,
					...resource
				})
			) : (
				<Lambda {...resource} />
			);
		case "gce":
			return noRender ? (
				new Gce({
					...Resource.defaultProps,
					...Gce.defaultProps,
					...resource
				})
			) : (
				<Gce {...resource} />
			);
		case "googleStorageBucket":
			return noRender ? (
				new StorageBucket({
					...Resource.defaultProps,
					...StorageBucket.defaultProps,
					...resource
				})
			) : (
				<StorageBucket {...resource} />
			);
		case "googleFunc":
			return noRender ? (
				new GoogleFunction({
					...Resource.defaultProps,
					...GoogleFunction.defaultProps,
					...resource
				})
			) : (
				<GoogleFunction {...resource} />
			);
		case "cloudRun":
			return noRender ? (
				new CloudRun({
					...Resource.defaultProps,
					...CloudRun.defaultProps,
					...resource
				})
			) : (
				<CloudRun {...resource} />
			);
	}
};
