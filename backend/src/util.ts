import fs from "fs";
import {rootBlockSplitBackend} from "./terraform/terraform";
import {
	NamedRequiredProvider,
	namedTerraformBackend,
	TerraformResource
} from "./types/terraform";

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

	fs.writeFileSync(filename, JSON.stringify(root, null, 2), {
		flag: "w"
	});
};
