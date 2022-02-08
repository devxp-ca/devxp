import {Model, Document, Schema} from "mongoose";

export type Doc<Base> = Base & Document;

export const generateSchema = <Base extends Record<string, any>>(
	base: Base
): Schema<Base, Model<Base>, Base> => {
	const mappedBase: any = {};
	Object.keys(base).map(key => {
		mappedBase[key] = {type: typeof base[key]};
	});
	return new Schema<Base, Model<Base>, Base>(mappedBase);
};

export interface DatabaseModel<Base> {
	toSchema(): Schema<Base, Model<Base>, Base>;
}
