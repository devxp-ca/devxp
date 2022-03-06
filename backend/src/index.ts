/**
 * This is the doc comment for index.ts
 *
 * Specify this is a module comment and rename it to my-module:
 * @module index
 */
import RESTServer from "./server";
import mainRouter from "./routes/index";
import {mongoose} from "./database/connection";

const server = new RESTServer();
server.serve("/");
server.serve("/toolManager");
server.serve("/about");
server.serve("/contact");
server.route("/", mainRouter);

import {testToFileAws} from "./util";
import {Ec2} from "./terraform/ec2";
import {prefabNetwork} from "./terraform/prefab";
import {S3} from "./terraform/s3";

testToFileAws(
	"/home/brennan/aws_test/devxp.tf",
	prefabNetwork(
		{
			ec2: [
				new Ec2("AUTO_UBUNTU", "t2.micro", "instance_a", false),
				new Ec2("AUTO_UBUNTU", "t2.micro", "instance_b", false)
			],
			s3: [
				new S3("devxp_test_bucket_a", false, "devxp-test-bucket-a"),
				new S3("devxp_test_bucket_b", false, "devxp-test-bucket-b")
			]
		},
		{
			ssh: true,
			web: true
		}
	)
);

mongoose.connection.on(
	"error",
	console.error.bind(console, "connection error:")
);
mongoose.connection.once("open", () => {
	server.start();
});
