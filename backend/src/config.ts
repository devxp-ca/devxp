import "dotenv/config";

export interface Config {
	CONNECTION_STRING: string;
	PORT: number;
}

//Ensure that CONNECTION_STRING env var is set for DB connection
const CONNECTION_STRING = process.env.CONNECTION_STRING;
if (!CONNECTION_STRING) {
	console.error("CONNECTION_STRING env variable must be set");
	process.exit(1);
}

//Check for port, and otherwise assign 8080
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

const CONFIG: Config = {
	CONNECTION_STRING,
	PORT
};
export default CONFIG;
