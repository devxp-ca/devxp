export const RESOURCE_LIST = {
	aws: [
		{
			name: "Virtual Machine",
			short_desc: "EC2 Cloud Computing",
			key: "ec2",
			description:
				"Amazon Elastic Compute Cloud (Amazon EC2) offers the broadest and deepest compute platform, with over 500 instances and choice of the latest processor, storage, networking, operating system, and purchase model to help you best match the needs of your workload. We are the first major cloud provider that supports Intel, AMD, and Arm processors, the only cloud with on-demand EC2 Mac instances, and the only cloud with 400 Gbps Ethernet networking. We offer the best price performance for machine learning training, as well as the lowest cost per inference instances in the cloud. More SAP, high performance computing (HPC), ML, and Windows workloads run on AWS than any other cloud.",
			link: "https://aws.amazon.com/ec2/",
			icon: "@mui/icons-material/Memory"
		},
		{
			name: "Database",
			short_desc: "NoSQL DynamoDB",
			key: "dynamoDb",
			description:
				"Amazon DynamoDB is a fully managed, serverless, key-value NoSQL database designed to run high-performance applications at any scale. DynamoDB offers built-in security, continuous backups, automated multi-Region replication, in-memory caching, and data export tools.",
			link: "https://aws.amazon.com/dynamodb/",
			icon: "@mui/icons-material/BackupTable"
		},
		{
			name: "Cloud Storage",
			short_desc: "Simple Storage Service S3",
			key: "s3",
			description:
				"Amazon Simple Storage Service (Amazon S3) is an object storage service offering industry-leading scalability, data availability, security, and performance. Customers of all sizes and industries can store and protect any amount of data for virtually any use case, such as data lakes, cloud-native applications, and mobile apps. With cost-effective storage classes and easy-to-use management features, you can optimize costs, organize data, and configure fine-tuned access controls to meet specific business, organizational, and compliance requirements.",
			link: "https://aws.amazon.com/s3/?nc=sn&loc=0",
			icon: "@mui/icons-material/Storage"
		},
		{
			name: "Archival Storage",
			short_desc: "Glacier S3 Storage",
			key: "glacierVault",
			description:
				"The Amazon S3 Glacier storage classes are purpose-built for data archiving, providing you with the highest performance, most retrieval flexibility, and the lowest cost archive storage in the cloud. All S3 Glacier storage classes provide virtually unlimited scalability and are designed for 99.999999999% (11 nines) of data durability. The S3 Glacier storage classes deliver options for the fastest access to your archive data and the lowest-cost archive storage in the cloud.",
			link: "https://docs.aws.amazon.com/glacier/index.html",
			icon: "@mui/icons-material/Backup"
		},
		{
			name: "Serverless",
			short_desc: "Lambda Function",
			key: "lambdaFunc",
			description:
				"Lambda is a compute service that lets you run code without provisioning or managing servers. Lambda runs your code on a high-availability compute infrastructure and performs all of the administration of the compute resources, including server and operating system maintenance, capacity provisioning and automatic scaling, code monitoring and logging. With Lambda, you can run code for virtually any type of application or backend service. All you need to do is supply your code in one of the languages that Lambda supports.",
			link: "https://docs.aws.amazon.com/lambda/index.html",
			icon: "@mui/icons-material/Functions"
		}
	],
	google: [
		{
			name: "Virtual Machine",
			short_desc: "GCE Cloud Computing",
			key: "gce",
			description:
				"Compute Engine is a computing and hosting service that lets you create and run virtual machines on Google infrastructure. Compute Engine offers scale, performance, and value that lets you easily launch large compute clusters on Google's infrastructure. There are no upfront investments, and you can run thousands of virtual CPUs on a system that offers quick, consistent performance. ",
			link: "https://cloud.google.com/compute/docs",
			icon: "@mui/icons-material/Memory"
		},
		{
			name: "Cloud Storage",
			short_desc: "Versatile Object Storage",
			key: "googleStorageBucket",
			description:
				"Cloud Storage allows world-wide storage and retrieval of any amount of data at any time. You can use Cloud Storage for a range of scenarios including serving website content, storing data for archival and disaster recovery, or distributing large data objects to users via direct download.",
			link: "https://cloud.google.com/storage/docs",
			icon: "@mui/icons-material/Storage"
		}
	],
	azure: [{}]
};
