import { SchemaWithReferences } from '../types/SchemaWithReferences';

export interface Contact {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly emailAddress: string;
  readonly phoneNumber: string;
  readonly role: 'PARTNER_ADMIN' | 'NON_CROWD';
}

export const exampleContact = (): Contact => ({
  id: '1',
  firstName: 'Name',
  lastName: 'Surname',
  emailAddress: 'email@example.com',
  phoneNumber: '031538572984',
  role: 'PARTNER_ADMIN',
});

export const contactSchema: SchemaWithReferences = {
  schema: {
    id: '/Contact',
    type: 'object',
    additionalProperties: true,
    properties: {
      id: {type: 'string'},
      firstName: {type: 'string'},
      lastName: {type: 'string'},
      emailAddress: {type: 'string'},
      phoneNumber: {type: 'string'},
      role: {type: 'string', 'enum': ['PARTNER_ADMIN', 'NON_CROWD']},
    },
    required: ['id', 'firstName', 'lastName', 'emailAddress', 'phoneNumber', 'role'],
  },
};
