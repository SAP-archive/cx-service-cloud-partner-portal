import { SyncStatus } from '../../model/sync-status';

export interface Contact {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string | null;
  phoneNumber: string | null;
  role: string;
  syncStatus: SyncStatus;
}

export const emptyContact = (): Contact => ({
  id: null,
  firstName: null,
  lastName: null,
  emailAddress: null,
  phoneNumber: null,
  role: null,
  syncStatus: null,
});

export const exampleContact = (): Contact => ({
  id: '1',
  firstName: 'Name',
  lastName: 'Surname',
  emailAddress: 'email@example.com',
  phoneNumber: '031538572984',
  role: 'PARTNER_ADMIN',
  syncStatus: 'IN_CLOUD',
});
