import * as express from 'express';
import { Validator } from 'jsonschema';
import { SchemaWithReferences } from '../../../types/SchemaWithReferences';

const loadReferencedSchemasFor = (schema: SchemaWithReferences, validator: Validator) => {
  if (schema.referencedSchemas) {
    schema.referencedSchemas.forEach(referencedSchema => {
      validator.addSchema(referencedSchema.schema);
      loadReferencedSchemasFor(referencedSchema, validator);
    });
  }
};

export const validateBody = (schemaWithReferences: SchemaWithReferences) => {
  const validator = new Validator();
  loadReferencedSchemasFor(schemaWithReferences, validator);

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;
    descriptor.value = (req: express.Request, res: express.Response, next: Function) => {
      if (!schemaWithReferences || !schemaWithReferences.schema) {
        throw new Error('Schema is not defined!');
      }
      const validationResults = validator.validate(req.body, schemaWithReferences.schema);
      if (validationResults.errors.length > 0) {
        const errorDetails = validationResults.errors.reduce((result, error) =>
          result += `Field ${error.property}: ${error.message}. `, '');
        res.status(400);
        res.send(`Error validating the request body. Details: ${errorDetails}`);
        return next();
      }

      fn(req, res, next);
    };
  };
};
