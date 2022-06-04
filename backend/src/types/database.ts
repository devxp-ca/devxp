import {
	Model,
	Document,
	Schema,
	SchemaDefinitionType,
	SchemaDefinition
} from "mongoose";

export type Doc<Base> = Base & Document;

export const generateSchema = <Base extends Record<string, any>>(
	base: Base
): Schema<Base, Model<Base>, Base> => {
	const mappedBase: SchemaDefinition<SchemaDefinitionType<Base>> =
		{} as SchemaDefinition<SchemaDefinitionType<Base>>;
	Object.keys(base)
		.filter(key => base[key] !== undefined && base[key] !== null)
		.map(key => {
			(mappedBase as Record<string, unknown>)[key] = {
				type: typeof base[key]
			};
		});
	return new Schema<Base, Model<Base>, Base>(mappedBase);
};

export const generateSchemaInternals = <Base extends Record<string, any>>(
	base: Base
): SchemaDefinition<SchemaDefinitionType<Base>> => {
	const mappedBase: SchemaDefinition<SchemaDefinitionType<Base>> =
		{} as SchemaDefinition<SchemaDefinitionType<Base>>;
	Object.keys(base).map(key => {
		(mappedBase as Record<string, unknown>)[key] = {type: typeof base[key]};
	});
	return mappedBase;
};

export interface DatabaseModel<Base> {
	toSchema(): Schema<Base, Model<Base>, Base>;
	toModel(): Model<Base>;
}

export const newModel = <Base>(base: DatabaseModel<Base>) => {
	const model = base.toModel();
	return new model({
		...base
	});
};
