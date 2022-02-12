import {named, providerName} from "../types/terraform";

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
		aws?: Base[];
		google?: Base[];
	} = {};
	(Array.isArray(namedBase) ? namedBase : [namedBase]).forEach(base => {
		destructuredBase[base.name] = [filter(removeName<Base>(base))];
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
