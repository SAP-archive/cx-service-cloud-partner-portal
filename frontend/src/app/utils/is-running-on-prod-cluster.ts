import { getEmbeddedConfig } from '../../environments/embedded-config';

const productionClusters = ['US', 'DE', 'IE', 'AU', 'CN'];

export const isRunningOnProdCluster = () => productionClusters.includes(getEmbeddedConfig().clusterName.toUpperCase());
