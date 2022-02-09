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

mongoose.connection.on(
	"error",
	console.error.bind(console, "connection error:")
);
mongoose.connection.once("open", () => {
	server.start();
});
