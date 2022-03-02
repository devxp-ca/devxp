import {named, providerName} from "../types/terraform";
import {arr} from "../util";

export const removeName = <Base>(namedBase: named<Base, any> | Base): Base => {
	if (!("name" in namedBase)) {
		return namedBase;
	}
	const {name, ...base} = namedBase;
	return base as unknown as Base;
};

export const namedDestructure = <Base>(
	namedBase: named<Base, providerName> | named<Base, providerName>[],
	filter: (base: Base) => Base = (base: Base) => base
) => {
	const destructuredBase: {
		aws?: Base;
		google?: Base;
	} = {};
	arr(namedBase).forEach(base => {
		destructuredBase[base.name] = filter(removeName<Base>(base));
	});
	return destructuredBase;
};

export const generateId = (length: number) => {
	let id = "";
	const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < length; i++) {
		id += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return id;
};

export const jsonRoot = (
	name: string,
	id: string,
	content: object | object[]
) => {
	const json: Record<string, any> = {};
	const internal: Record<string, any> = {};
	internal[id] = [content];

	json[name] = [internal];
	return json;
};
