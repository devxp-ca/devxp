import axios from "axios";
import fs from "fs";
import {BackendModel} from "./database/bucket";
import {NamedAwsBackend} from "./terraform/awsBackend";
import {AwsProvider} from "./terraform/awsProvider";
import {rootBlock} from "./terraform/terraform";
import {
	NamedRequiredProvider,
	namedTerraformBackend,
	providerName,
	TerraformResource
} from "./types/terraform";

/* eslint-disable @typescript-eslint/no-var-requires */
const HCL = require("js-hcl-parser");

export const arr = <T>(data: T | T[]) => (Array.isArray(data) ? data : [data]);

export const bucketExists = (bucket: string, mode: providerName) => {
	if (mode === "aws") {
		return awsBucketExists(bucket);
	}
	// else if(mode === "google"){
	else {
		return googleBucketExists(bucket);
	}
};

export const googleBucketExists = (bucket: string): Promise<boolean> => {
	return BackendModel.findOne({
		bucketId: bucket
	}).then(backend => {
		return Promise.resolve(!!backend);
	});
};

export const awsBucketExists = (bucket: string) =>
	new Promise<boolean>((resolve, reject) => {
		axios
			.get(`https://${bucket}.s3.amazonaws.com`)
			.then(() => resolve(true))
			.catch(err => {
				if (err.response?.status === 403) {
					resolve(true);
				} else if (err.response?.status === 404) {
					resolve(false);
				} else {
					reject(err);
				}
			});
	});

export const testToFile = (
	filename: string,
	providers: NamedRequiredProvider[] | NamedRequiredProvider,
	backends: namedTerraformBackend,
	resources: TerraformResource[] = []
) => {
	const [root, backend] = rootBlock(providers, backends, resources);

	fs.writeFileSync(filename, jsonToHcl(root), {
		flag: "w"
	});
	fs.writeFileSync(`backend_${filename}`, jsonToHcl(backend), {
		flag: "w"
	});
};
export const testToFileAws = (
	filename: string,
	resources: TerraformResource[] = []
) => testToFile(filename, new AwsProvider(), new NamedAwsBackend(), resources);

export const jsonToHcl = (json: string | Record<string, any>) => {
	if (typeof json !== "string") {
		json = JSON.stringify(json, null, 2);
	}
	let hcl: string = HCL.stringify(json);

	//Unpack the opening resource and data block
	hcl = hcl.replace(
		/"(resource|data)" = {\n {2}"([^"]+)" = {\n {4}"([^"]+)" = {/g,
		(_match, $1, $2, $3) => `${$1} "${$2}" "${$3}" {`
	);

	//Remove the hanging closing tags
	hcl = hcl.replace(/ {4}}\n {2}}/g, "");

	//Unpack the opening provider
	hcl = hcl.replace(
		/"provider" = {\n {2}"([^"]+)" = {/g,
		(_match, $1) => `provider "${$1}" {`
	);

	//Remove the hanging closing tags
	hcl = hcl.replace(/ {2}}\n}/g, "}");

	//Unpack variables
	hcl = hcl.replace(
		/"variable" = {\n {2}"([^"]+)" = {/g,
		(_match, $1) => `variable "${$1}" {`
	);

	//Remove the hanging closing tags
	hcl = hcl.replace(/ {2}}\n}/g, "}");

	//Unpack outputs
	hcl = hcl.replace(
		/"output" = {\n {2}"([^"]+)" = {/g,
		(_match, $1) => `output "${$1}" {`
	);

	//Remove the hanging closing tags
	hcl = hcl.replace(/ {2}}\n}/g, "}");

	//Unback backend block
	hcl = hcl.replace(
		/"backend" = {\n {4}"([^"]+)" = {([^}]+)}/g,
		(_match, $1, $2) => `backend "${$1}" {${$2}  }\n}`
	);

	//Formatting
	hcl = hcl.replace(/\n\n/g, "\n");
	hcl = hcl.replace(/^}$/gm, "}\n");

	//Unpack references
	hcl = hcl.replace(/"\${([^}]+)}"/g, (_match, $1) => $1);

	//Remove variable quotes
	hcl = hcl.replace(/"([^"]+)" = /g, (_match, $1) => `${$1} = `);

	//Fix up required providers block
	hcl = hcl.replace(
		/terraform = {\n {2}"([^"]+)" "([^"]+)"([^}]+)}/g,
		(_match, $1, $2, $3) =>
			`terraform {\n  ${$1} {\n    ${$2} = ${$3}}\n}\n}`
	);

	//Fix up backend block
	hcl = hcl.replace(/terraform = {/g, "terraform {");

	//Remove incorrect block as attribute styles
	hcl = hcl.replace(
		/(lifecycle|ingress|egress|statement|filter|route|notification|ttl|attribute|default_action|vpc_config|initialize_params|boot_disk|network_interface|template|spec|containers|env|traffic|metadata|variable|output) = {/g,
		(_match, $1) => `${$1} {`
	);

	//Remove quote escaping for functions
	hcl = hcl.replace(/\(\\\"([^\\]+)\\\"\)/g, (_match, $1) => `("${$1}")`);

	//Remove incorrect ignore quotes
	hcl = hcl.replace(/(ignore_changes = \[[^\]]+\])/g, (_match, $1) =>
		$1.replace(/"/g, "")
	);

	//Cleanup
	hcl = hcl.replace(/}\n}\n}/g, "    }\n  }\n}");
	hcl = hcl.replace(/ *data = \[\]/, "");
	hcl = hcl.replace(/ *env = \[\]/, "");
	hcl = hcl.replace(/ *variable = \[\]/, "");
	hcl = hcl.replace(/ *output = \[\]/, "");
	hcl = hcl.replace(/ *resource = \[\]/, "");
	/*
	//Merge duplicate blocks into arrays
	let matches: Record<string, string[]> = {}
	hcl = hcl.replace(/([a-zA-Z0-9_-]+) = ({[^}]+})/g, (_match, $1, $2) => {

		matches[$1] = [...(matches[$1] ?? []), $2];
		return `MARKER_${$1}`;//`${$1} = [${$2}]`
	});

	Object.keys(matches).forEach(key => {
		let json;
		if(matches[key].length === 1){
			json = `${key} = ${matches[key]}`;
		}
		else{
			json = `${key} = [${matches[key].reduce((acc, obj) => `${acc}, ${obj}`)}]`;
		}
		hcl = hcl.replace(new RegExp(`MARKER_${key}`), json);
		hcl = hcl.replace(new RegExp(`MARKER_${key}`, "g"), "");
	});
	*/

	return hcl;
};
