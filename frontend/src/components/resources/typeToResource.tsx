import React from "react";
import Ec2 from "./Ec2";
import S3 from "./S3";
import Glacier from "./Glacier";
import DynamoDb from "./DynamoDb";
import Gce from "./Gce";
import StorageBucket from "./StorageBucket";
import Resource from "./Resource";

export default (
	resource: {
		type: string;
	} & any,
	noRender: boolean = false
) => {
	console.dir(resource);
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
			break;
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
			break;
		case "glacier":
			return noRender ? (
				new Glacier({
					...Resource.defaultProps,
					...Glacier.defaultProps,
					...resource
				})
			) : (
				<Glacier {...resource} />
			);
			break;
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
			break;
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
			break;
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
			break;
	}
};
