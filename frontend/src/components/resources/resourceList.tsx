export const RESOURCE_LIST = {
	aws: [
		{
			name: "Remote Server",
			key: "ec2",
			description:
				"A Virtual Machine that can be used for remote computing, webhosting, and other purposes."
		},
		{
			name: "NoSQL Database",
			key: "dynamoDb",
			description:
				"DynamoDB is a fully managed proprietary NoSQL database service that supports key-value and document data structures and is offered by Amazon.com as part of the Amazon Web Services portfolio."
		},
		{
			name: "Scalable Storage",
			key: "s3",
			description:
				"Amazon S3 or Amazon Simple Storage Service is a service offered by Amazon Web Services that provides object storage through a web service interface"
		},
		{
			name: "Archival Storage",
			key: "glacierVault",
			description:
				"Amazon S3 Glacier is an online file storage web service that provides storage for data archiving and backup."
		}
	],
	google: [
		{
			name: "Remote Server",
			key: "gce",
			description:
				"A Virtual Machine that can be used for remote computing, webhosting, and other purposes."
		},
		{
			name: "Scalable storage",
			key: "googleStorageBucket",
			description: "Reliable and secure object storage."
		}
	],
	azure: [{}]
};
