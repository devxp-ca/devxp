import {gcpRegion, TerraformJson} from "../types/terraform";
import {jsonRoot, output} from "./util";
import {Resource} from "./resource";

export interface GoogleCloudRun {
	project: string;
	location: gcpRegion;
	image: string;
	env: string[];
	domain?: string;
}
export class GoogleCloudRun
	extends Resource<GoogleCloudRun>
	implements GoogleCloudRun
{
	constructor(
		project: string,
		id: string,
		image: string,
		env: string[] = [],
		domain?: string,
		location: gcpRegion = "us-west1",
		name?: string
	) {
		super(id, "cloudRun", false, name);
		this.project = project;
		this.location = location;
		this.image = image;
		this.env = env;
		this.domain = domain;
	}

	getVars() {
		return [...super.getVars(), ...this.env.map(name => `${name}`)];
	}

	//Returns an array of resource blocks
	toJSON() {
		let json = [
			jsonRoot("google_cloud_run_service", this.id, {
				name: this.name,
				location: this.location,
				autogenerate_revision_name: true,
				template: [
					{
						spec: [
							{
								containers: [
									{
										image: this.image,
										env: this.env.map((name: string) => ({
											name,
											value: `\${var.${name}}`
										}))
									}
								]
							}
						]
					}
				],
				traffic: [
					{
						percent: 100,
						latest_revision: true
					}
				],
				depends_on: [`\${google_project_service.${this.id}-service}`]
			}),
			jsonRoot("google_cloud_run_service_iam_member", `${this.id}-iam`, {
				service: `\${google_cloud_run_service.${this.id}.name}`,
				location: `\${google_cloud_run_service.${this.id}.location}`,
				project: `\${google_cloud_run_service.${this.id}.project}`,
				role: `roles/run.invoker`,
				member: "allUsers"
			}),
			jsonRoot("google_project_service", `${this.id}-service`, {
				disable_on_destroy: false,
				service: "run.googleapis.com"
			})
		];

		if (this.domain) {
			json = [
				...json,
				jsonRoot(
					"google_cloud_run_domain_mapping",
					`${this.id}-domain-mapping`,
					{
						location: this.location,
						name: this.domain,
						metadata: [
							{
								namespace: this.project
							}
						],
						spec: [
							{
								route_name: `\${google_cloud_run_service.${this.id}.name}`
							}
						]
					}
				)
			];
		}
		return json;
	}

	postProcess(json: TerraformJson) {
		json = super.postProcess(json);

		json.output = [
			...json.output,
			output(
				`${this.id}-service-url`,
				`\${google_cloud_run_service.${this.id}.status[0].url}`
			)
		];

		return json;
	}
}
