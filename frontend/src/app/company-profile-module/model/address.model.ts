import { SyncStatus } from '../../model/sync-status';

export interface Address {
  id: string | null;
  streetName: string | null;
  number: string | null;
  city: string | null;
  zipCode: string | null;
  country: string | null;
  syncStatus: SyncStatus;
}

export const emptyAddress = (): Address => ({
  id: null,
  city: null,
  country: null,
  number: null,
  streetName: null,
  zipCode: null,
  syncStatus: null,
});

export const exampleAddress = (): Address => ({
  id: '1',
  city: 'North Laisha',
  country: 'Japan',
  number: '571',
  streetName: 'Long',
  zipCode: '74002',
  syncStatus: 'IN_CLOUD',
});
