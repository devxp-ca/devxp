import {gcpRegion, googleRuntime, TerraformJson} from "../types/terraform";
import {jsonRoot} from "./util";
import {Resource} from "./resource";
import {GoogleStorageBucket} from "./googleStorageBucket";

export interface GoogleFunction {
	project: string;
	location: gcpRegion;
	runtime: googleRuntime;
	memory: number;
	entry_point: string;
	source_dir: string;
	trigger_http: boolean;
}
export class GoogleFunction
	extends Resource<GoogleFunction>
	implements GoogleFunction
{
	constructor(
		project: string,
		id: string,
		runtime: googleRuntime,
		entry_point: string,
		source_dir: string,
		trigger_http = false,
		memory = 128,
		location: gcpRegion = "us-west1",
		name?: string
	) {
		super(id, "Gce", false, name);
		this.project = project;
		this.location = location;
		this.runtime = runtime;
		this.memory = memory;
		this.entry_point = entry_point;
		this.source_dir = source_dir;
		this.trigger_http = trigger_http;
	}

	//Returns an array of resource blocks
	toJSON() {
		return [
			//The compute instance itself
			jsonRoot("google_cloudfunctions_function", this.id, {
				name: this.name,
				runtime: this.runtime,
				available_memory_mb: this.memory,
				source_archive_bucket: `\${google_storage_bucket.${this.id}-bucket.name}`,
				source_archive_object: `\${google_storage_bucket_object.${this.id}-zip.name}`,
				trigger_http: true,
				entry_point: this.entry_point,
				project: this.project,
				depends_on: [`\${google_project_service.${this.id}-service}`]
			}),
			//The resource block calling for google cloud to enable the cloud functions service
			jsonRoot("google_project_service", `${this.id}-service`, {
				disable_on_destroy: false,
				project: this.project,
				service: "cloudfunctions.googleapis.com"
			}),

			jsonRoot("google_storage_bucket_object", `${this.id}-zip`, {
				name: `source.zip#\${data.archive_file.${this.id}-archive.output_md5}`,
				bucket: `\${google_storage_bucket.${this.id}-bucket.name}`,
				source: `\${data.archive_file.${this.id}-archive.output_path}`
			}),
			...new GoogleStorageBucket(
				this.project,
				`${this.id}-bucket`,
				this.location,
				`${this.id}-devxp-storage-bucket-for-func`
			).toJSON(),

			jsonRoot("google_cloudfunctions_function_iam_member", "invoker", {
				project: `\${google_cloudfunctions_function.${this.id}.project}`,
				region: `\${google_cloudfunctions_function.${this.id}.region}`,
				cloud_function: `\${google_cloudfunctions_function.${this.id}.name}`,
				role: "roles/cloudfunctions.invoker",
				member: "allUsers"
			})
		];
	}

	postProcess(json: TerraformJson) {
		json = super.postProcess(json);

		json.data = [
			...json.data,
			jsonRoot("archive_file", `${this.id}-archive`, {
				type: "zip",
				source_dir: this.source_dir,
				output_path: `/tmp/function-${this.id}.zip`
			})
		];

		return json;
	}
}
