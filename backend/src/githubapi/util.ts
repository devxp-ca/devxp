export const GITHUB_BASE_URL = "https://api.github.com";
export const createGithubHeader = (token: string) => ({
	headers: {
		Authorization: `token ${token}`
	}
});
