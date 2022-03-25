import fs from "fs";
import {NamedAwsBackend} from "./terraform/awsBackend";
import {AwsProvider} from "./terraform/awsProvider";
import {rootBlockSplitBackend} from "./terraform/terraform";
import {
	NamedRequiredProvider,
	namedTerraformBackend,
	TerraformResource
} from "./types/terraform";

/* eslint-disable @typescript-eslint/no-var-requires */
const HCL = require("js-hcl-parser");

export const arr = <T>(data: T | T[]) => (Array.isArray(data) ? data : [data]);

export const testToFile = (
	filename: string,
	providers: NamedRequiredProvider[] | NamedRequiredProvider,
	backends: namedTerraformBackend,
	resources: TerraformResource[] = []
) => {
	const [root, backend] = rootBlockSplitBackend(
		providers,
		backends,
		resources
	);

	fs.writeFileSync(filename, jsonToHcl(root), {
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

	//Remove incorrect block as attribute styles
	hcl = hcl.replace(
		/(lifecycle|ingress|egress|statement|filter|route|notification|ttl|attribute|default_action|vpc_config|initialize_params|boot_disk|network_interface|template|spec|containers|env|traffic|metadata|variable) = {/g,
		(_match, $1) => `${$1} {`
	);

	//Remove quote escaping for functions
	hcl = hcl.replace(/\(\\\"([^\\]+)\\\"\)/, (_match, $1) => `("${$1}")`);

	//Remove incorrect ignore quotes
	hcl = hcl.replace(/(ignore_changes = \[[^\]]+\])/g, (_match, $1) =>
		$1.replace(/"/g, "")
	);

	//Cleanup
	hcl = hcl.replace(/}\n}\n}/g, "    }\n  }\n}");
	hcl = hcl.replace(/ *data = \[\]/, "");
	hcl = hcl.replace(/ *env = \[\]/, "");
	hcl = hcl.replace(/ *variable = \[\]/, "");
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
