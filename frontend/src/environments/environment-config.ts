import { ClusterConfig } from './cluster-config';

export interface EnvironmentConfig {
  production: boolean;
  appBackendUrl: string;
  clusterConfigs: ClusterConfig[];
}
