export interface Config {
	BACKEND_URL: string;
	AUTH_PATH: string;
	REPO_PATH: string;
	REPO_FILES_PATH: string;
	REPO_PAGES_PATH: string;
	SETTINGS_PATH: string;
}

export const CONFIG: Config = {
	BACKEND_URL: window.location.origin,
	AUTH_PATH: "/auth",
	REPO_PATH: "/api/v1/repo",
	REPO_FILES_PATH: "/api/v1/repo/file",
	REPO_PAGES_PATH: "/api/v1/repoPages",
	SETTINGS_PATH: "/api/v1/settings"
};
