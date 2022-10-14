import {jsonRoot} from "./util";
import {Resource} from "./resource";

export interface TlsPrivateKey {
	algorithm: string;
	rsa_bits: number;
}
export class TlsPrivateKey
	extends Resource<TlsPrivateKey>
	implements TlsPrivateKey
{
	constructor(id: string, autoIam = false, name: string = id) {
		super(id, "TlsPrivateKey", autoIam, name);
		this.algorithm = "RSA";
		this.rsa_bits = 4096;
	}

	toJSON() {
		return jsonRoot("tls_private_key", this.id, {
			algorithm: this.algorithm,
			rsa_bits: this.rsa_bits
		});
	}
}
