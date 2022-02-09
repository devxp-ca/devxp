import RESTServer from "./server";
import mainRouter from "./routes/index";
import {mongoose} from "./database/connection";
import {
	AwsProvider,
	GoogleProvider,
	NamedAwsBackend,
	NamedGoogleBackend
} from "./types/terraform";
import {rootBlock} from "./terraform/terraform";

const server = new RESTServer();
server.serve("/");
server.serve("/wizard");
server.serve("/about");
server.serve("/contact");
server.route("/", mainRouter);

console.log(
	JSON.stringify(
		rootBlock(
			new AwsProvider(
				"hashicorp/aws",
				">= 2.7.0",
				"uswest-1",
				"ACCESS_KEY",
				"SECRET_KEY"
			),
			new NamedAwsBackend(
				"UNIQUE_BUCKET_NAME",
				"terraform/state",
				"uswest-1"
			)
		),
		null,
		2
	)
);

mongoose.connection.on(
	"error",
	console.error.bind(console, "connection error:")
);
mongoose.connection.once("open", () => {
	server.start();
});
