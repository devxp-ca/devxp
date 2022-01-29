import RESTServer from "./server";
import mainRouter from "./routes/index";

const server = new RESTServer();
server.route("/", mainRouter);
server.start();

//asdf
