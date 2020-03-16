import { Contact, emptyContact, exampleContact } from './contact.model';
import { Address, emptyAddress, exampleAddress } from './address.model';
import { emptyServiceArea, exampleServiceArea, ServiceArea } from '../../model/service-area.model';

export interface CompanyDetails {
  id: string | null;
  name: string | null;
  remarks: string | null;
  inactive: boolean;
  contact: Contact;
  address: Address;
  serviceArea: ServiceArea;
}

export const emptyCompanyDetails = (): CompanyDetails => ({
  id: null,
  name: null,
  remarks: null,
  inactive: false,
  contact: emptyContact(),
  address: emptyAddress(),
  serviceArea: emptyServiceArea(),
});

export const exampleCompanyDetails = (): CompanyDetails => ({
  id: '1',
  name: 'My Company Ltd.',
  remarks: 'A solid company',
  inactive: false,
  contact: exampleContact(),
  address: exampleAddress(),
  serviceArea: exampleServiceArea(),
});
