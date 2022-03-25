/**
 * This is the doc comment for index.ts
 *
 * Specify this is a module comment and rename it to my-module:
 * @module index
 */
import RESTServer from "./server";
import mainRouter from "./routes/index";
import {mongoose} from "./database/connection";

import {testToFile} from "./util";
import {AzureProvider} from "./terraform/azureProvider";
import {NamedAzureBackend} from "./terraform/azureBackend";
import {AwsProvider} from "./terraform/awsProvider";
import {NamedAwsBackend} from "./terraform/awsBackend";
import {Ec2} from "./terraform/ec2";

const PROJECT = "devxp-339721";
testToFile(
	"/Users/ctpet/Desktop/azure/terraform_test.tf",
	// new AwsProvider(),
	// new NamedAwsBackend(),
	// [new Ec2("AUTO_UBUNTU", "t2.micro", "my-instance")]
	new AzureProvider(),
	new NamedAzureBackend()
);

const server = new RESTServer();
server.serve("/");
server.serve("/toolManager");
server.serve("/about");
server.serve("/contact");
server.route("/", mainRouter);

// import {GoogleFunction} from "./terraform/googleFunction";
// import {testToFile} from "./util";
// import {GoogleProvider} from "./terraform/googleProvider";
// import {NamedGoogleBackend} from "./terraform/googleBackend";

// const PROJECT = "devxp-339721";
// testToFile(
// 	"/home/brennan/aws_test/devxp.tf",
// 	new GoogleProvider(PROJECT),
// 	new NamedGoogleBackend(PROJECT),
// 	[
// 		new GoogleFunction(
// 			PROJECT,
// 			"my-func",
// 			"nodejs16",
// 			"main",
// 			"/home/brennan/aws_test",
// 			true
// 		)
// 	]
// );

mongoose.connection.on(
	"error",
	console.error.bind(console, "connection error:")
);
mongoose.connection.once("open", () => {
	server.start();
});
