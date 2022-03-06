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
import {AwsVpc} from "./terraform/awsVpc";
import {AwsSecurityGroup} from "./terraform/AwsSecurityGroup";

const vpc = "my_vpc_for_devxp";
const cidr = "10.0.0.0/24";

testToFileAws("/home/brennan/aws_test/devxp.tf.json", [
	new Ec2("AUTO_UBUNTU", "t2.medium", "myinstance", true, true),
	new AwsVpc(cidr, true, vpc),
	new AwsSecurityGroup(`securitygroup_for_devp`, vpc, [
		{
			type: "ingress",
			from_port: 433,
			to_port: 433,
			protocol: "tcp",
			cidr_blocks: [cidr]
		},
		{
			type: "ingress",
			from_port: 80,
			to_port: 80,
			protocol: "tcp",
			cidr_blocks: [cidr]
		},
		{
			type: "egress",
			from_port: 0,
			to_port: 0,
			protocol: "-1",
			cidr_blocks: ["0.0.0.0/0"]
		}
	])
]);

mongoose.connection.on(
	"error",
	console.error.bind(console, "connection error:")
);
mongoose.connection.once("open", () => {
	server.start();
});
