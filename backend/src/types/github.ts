const noNullProps = (object: any): boolean =>
	Object.values(object).reduce(
		(acc: boolean, prop) => acc && prop !== undefined && prop !== null,
		true
	);

export interface GithubBlob {
	sha: string;
	url: string;
}

export const isGithubBlob = (object: any): object is GithubBlob =>
	"sha" in object && "url" in object;

export interface GithubTreeNode {
	path: string;
	mode: string;
	type: string;
	sha: string;
	size?: number;
	url: string;
}
export const isGithubTreeNode = (object: any): object is GithubTreeNode =>
	"path" in object &&
	"mode" in object &&
	"type" in object &&
	"sha" in object &&
	"url" in object &&
	noNullProps(object);

export interface GithubTree {
	sha: string;
	url: string;
	tree: GithubTreeNode[];
}
export const isGithubTree = (object: any): object is GithubTree =>
	"sha" in object &&
	"url" in object &&
	"tree" in object &&
	Array.isArray(object.tree) &&
	object.tree.reduce(
		(acc: boolean, repo: any) => acc && isGithubTreeNode(repo),
		true
	) &&
	noNullProps(object);

//Relevant data we want to keep about a user
//This may and prob will change over time
export interface GithubProfile {
	login: string;
	id: number;
	name: string;
	avatar_url: string;
}
export const isGithubProfile = (object: any): object is GithubProfile =>
	"login" in object &&
	"id" in object &&
	"name" in object &&
	"avatar_url" in object &&
	noNullProps(object);

//Relevant data we want to keep about a repo
//This may and prob will change over time
export interface GithubRepo {
	id: number;
	name: string;
	full_name: string;
	description: string;
	url: string;
	html_url: string;
	forks_count: number;
	stargazers_count: number;
	visibility: string;
}
export const isGithubRepo = (object: any): object is GithubRepo =>
	"id" in object &&
	"name" in object &&
	"full_name" in object &&
	"description" in object &&
	"url" in object &&
	"html_url" in object &&
	"forks_count" in object &&
	"stargazers_count" in object &&
	"visibility" in object &&
	noNullProps(object);

export interface GithubReference {
	sha: string;
	url: string;
}
export const isGithubReference = (object: any): object is GithubReference =>
	"sha" in object && "url" in object && noNullProps(object);

export interface GithubCommit {
	commitSha: string;
	treeSha: string;
	treeUrl: string;
}
export const isGithubCommit = (object: any): object is GithubCommit =>
	"commitSha" in object &&
	"treeSha" in object &&
	"treeUrl" in object &&
	noNullProps(object);
