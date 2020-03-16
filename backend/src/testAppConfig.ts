import { ClientConfiguration } from '@modules/common';

export const TEST_APP_CONFIG: ClientConfiguration = {
  backendClusterDomain: 'testing.coresuite.com',
  backendClusterPort: '1234',
  directoryServiceUrl: 'https://ds.mock.coresuite.com',
  clientIdentifier: 'partner-portal',
  clientSecret: 'partner-portal-test',
  clientVersion: '1.0.0',
  debug: true,
};
