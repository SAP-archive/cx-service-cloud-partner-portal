import { SchemaWithReferences } from '../types/SchemaWithReferences';

export interface Address {
  readonly id: string;
  readonly streetName: string;
  readonly number: string;
  readonly city: string;
  readonly zipCode: string;
  readonly country: string;
}

export const exampleAddress = (): Address => ({
  id: '1',
  city: 'North Laisha',
  country: 'Japan',
  number: '571',
  streetName: 'Long',
  zipCode: '74002',
});

export const addressSchema: SchemaWithReferences = {
  schema: {
    id: '/Address',
    type: 'object',
    additionalProperties: true,
    properties: {
      id: {type: 'string'},
      streetName: { type: ['string', 'null'] },
      number: { type: ['string', 'null'] },
      city: { type: ['string', 'null'] },
      zipCode: { type: ['string', 'null'] },
      country: { type: ['string', 'null'] },
    },
    required: ['id'],
  },
};
