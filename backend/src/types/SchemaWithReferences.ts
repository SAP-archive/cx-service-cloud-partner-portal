import { Schema } from 'jsonschema';

export type SchemaWithReferences = { schema: Schema, referencedSchemas?: SchemaWithReferences[] };
