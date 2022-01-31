import {GithubTreeNodeMode} from "../types/github";

export const GITHUB_BASE_URL = "https://api.github.com";
export const createGithubHeader = (token: string) => ({
	headers: {
		Authorization: `token ${token}`
	}
});

//Convert a descriptive mode like "blob" to it's corresponding hash number
export const getModeNumber = (
	mode:
		| "blob"
		| "executable"
		| "subdirectory"
		| "tree"
		| "submodule"
		| "commit"
		| "symlink"
): GithubTreeNodeMode =>
	({
		blob: "100644",
		executable: "100755",
		subdirectory: "040000",
		tree: "040000",
		submodule: "160000",
		commit: "160000",
		symlink: "120000"
	}[mode] as GithubTreeNodeMode);
