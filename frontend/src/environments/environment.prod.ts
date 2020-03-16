import { EnvironmentConfig } from './environment-config';
import { clusterConfigs } from './cluster-configs';

export const environment: EnvironmentConfig = {
  production: true,
  appBackendUrl: 'portal',
  clusterConfigs
};
