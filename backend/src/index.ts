import RESTServer from "./server";
import mainRouter from "./routes/index";
import {mongoose} from "./database/connection";
import {GoogleProvider, NamedGoogleBackend} from "./types/terraform";
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
			new GoogleProvider(
				"hashicorp/gcs",
				">= 2.7.0",
				"devxp",
				"uswest-1"
			),
			new NamedGoogleBackend(
				"UNIQUE_BUCKET_NAME",
				"terraform/state",
				"uswest-1"
			)
		),
		null,
		4
	)
);

mongoose.connection.on(
	"error",
	console.error.bind(console, "connection error:")
);
mongoose.connection.once("open", () => {
	server.start();
});
