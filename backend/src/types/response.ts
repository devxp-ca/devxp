export interface BaseResponse {
	pullRequest: string;
	user: number;
	tool: "terraform" | "pipeline";
}

export interface TerraformResponse extends BaseResponse {
	initialPullRequest?: string;
	provider: string;
	tool: "terraform";
}
