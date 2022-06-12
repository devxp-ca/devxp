import {jsonRoot, output} from "./util";
import {Resource} from "./resource";
import {TerraformJson} from "../types/terraform";
import {TlsPrivateKey} from "./tlsPrivateKey";

// resource "aws_key_pair" "ssh-key" {
//   key_name   = "ssh-key"
//   public_key = "ssh-rsa AAAAB3Nza............"
// }

export interface AwsKeyPair {
	tlsKey: TlsPrivateKey;
	key_name: string;
}
export class AwsKeyPair extends Resource<AwsKeyPair> implements AwsKeyPair {
	constructor(id: string, autoIam = false, name: string = id) {
		super(id, "AwsKeyPair", autoIam, name);
		this.tlsKey = new TlsPrivateKey(`${this.id}_tls_key`);
		this.key_name = name;
	}

	toJSON() {
		return [
			this.tlsKey.toJSON(),
			jsonRoot("aws_key_pair", this.id, {
				public_key: `\${tls_private_key.${this.id}_tls_key.public_key_openssh}`,
				key_name: this.key_name
			}),
			jsonRoot("local_sensitive_file", `${this.id}_pem_file`, {
				filename: `\${pathexpand("~/.ssh/${this.id}.pem")}`,
				file_permission: "600",
				directory_permission: "700",
				content: `\${tls_private_key.${this.id}_tls_key.private_key_pem}`
			})
		];
	}

	postProcess(json: TerraformJson): TerraformJson {
		json = super.postProcess(json);
		json.output = [
			...json.output,
			output(
				`${this.id}-private_key`,
				`\${tls_private_key.${this.id}_tls_key.private_key_pem}`,
				true
			)
		];
		return json;
	}
}
