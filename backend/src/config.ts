import "dotenv/config";

export interface Config {
	CONNECTION_STRING: string;
	PORT: number;
	GITHUB_CLIENT_ID: string;
	GITHUB_CLIENT_SECRET: string;
	GITHUB_SCOPES: string[];
	TERRAFORM: {
		BACKEND_BUCKET: string;
	};
}

const envCheck = <T>(env: T | undefined, name = "every") => {
	if (!env) {
		console.error(`${name} env variable must be set`);
		process.exit(1);
	}
	return env as T;
};

//Ensure that CONNECTION_STRING env var is set for DB connection
const CONNECTION_STRING = envCheck(
	process.env.CONNECTION_STRING,
	"CONNECTION_STRING"
);

//Ensure that Github data is set for oauth
const GITHUB_CLIENT_ID = envCheck(
	process.env.GITHUB_CLIENT_ID,
	"GITHUB_CLIENT_ID"
);
const GITHUB_CLIENT_SECRET = envCheck(
	process.env.GITHUB_CLIENT_SECRET,
	"GITHUB_CLIENT_SECRET"
);

//Check for port, and otherwise assign 8080
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

const CONFIG: Config = {
	CONNECTION_STRING,
	PORT,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GITHUB_SCOPES: ["workflow", "repo"],
	TERRAFORM: {
		BACKEND_BUCKET: "terraform_backend_bucket"
	}
};
export default CONFIG;
