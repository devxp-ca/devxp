import {providerName} from "./terraform";

export interface BaseResponse {
	pullRequest: string;
	user: number;
	tool: "terraform" | "pipeline";
}

export interface TerraformResponse extends BaseResponse {
	initialPullRequest?: string;
	provider: providerName;
	tool: "terraform";
}
export interface PipelineResponse extends BaseResponse {
	tool: "pipeline";
}
export interface PipelineWithTerraformResponse extends PipelineResponse {
	provider: providerName;
}
export interface PipelineWithGoogleResponse
	extends PipelineWithTerraformResponse {
	project: string;
}
