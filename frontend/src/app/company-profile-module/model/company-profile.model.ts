import { Contact, emptyContact, exampleContact } from './contact.model';
import { Address, emptyAddress, exampleAddress } from './address.model';
import { emptyServiceArea, exampleServiceArea, ServiceArea } from '../../model/service-area.model';
import { SyncStatus } from '../../model/sync-status';

export interface CompanyDetails {
  id: string | null;
  name: string | null;
  remarks: string | null;
  inactive: boolean;
  syncStatus: SyncStatus;
  contact: Contact;
  address: Address;
  serviceArea: ServiceArea;
}

export const emptyCompanyDetails = (): CompanyDetails => ({
  id: null,
  name: null,
  remarks: null,
  inactive: false,
  syncStatus: null,
  contact: emptyContact(),
  address: emptyAddress(),
  serviceArea: emptyServiceArea(),
});

export const exampleCompanyDetails = (): CompanyDetails => ({
  id: '1',
  name: 'My Company Ltd.',
  remarks: 'A solid company',
  inactive: false,
  syncStatus: 'IN_CLOUD',
  contact: exampleContact(),
  address: exampleAddress(),
  serviceArea: exampleServiceArea(),
});
