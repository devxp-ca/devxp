export interface BaseResponse {
	pullRequest: string;
	user: number;
}

export interface TerraformResponse extends BaseResponse {
	initialPullRequest?: string;
	provider: string;
}
