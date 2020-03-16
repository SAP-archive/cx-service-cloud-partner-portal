import { Contact, contactSchema, exampleContact } from './Contact';
import { Address, addressSchema, exampleAddress } from './Address';
import { SchemaWithReferences } from '../types/SchemaWithReferences';
import { exampleServiceArea, ServiceArea, serviceAreaSchema } from './ServiceArea';
import { exampleBusinessPartnerDto } from '@modules/data-access/dtos/BusinessPartnerDto';

export interface CompanyDetails {
  readonly id: string;
  readonly name: string;
  readonly remarks: string | null;
  readonly inactive: boolean;
  readonly contact: Contact;
  readonly address: Address;
  readonly serviceArea: ServiceArea;
}

export const exampleCompanyDetails = (): CompanyDetails => ({
  ...exampleBusinessPartnerDto(),
  contact: exampleContact(),
  address: exampleAddress(),
  serviceArea: exampleServiceArea(),
});

export const companyDetailsSchema: SchemaWithReferences = {
  schema: {
    id: '/CompanyDetails',
    type: 'object',
    additionalProperties: true,
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
      remarks: {type: ['string', 'null']},
      inactive: {type: 'boolean'},
      contact: {$ref: '/Contact'},
      address: {$ref: '/Address'},
      serviceArea: {$ref: '/ServiceArea'},
    },
    required: ['id', 'name', 'contact', 'address', 'serviceArea'],
  },
  referencedSchemas: [contactSchema, addressSchema, serviceAreaSchema],
};
