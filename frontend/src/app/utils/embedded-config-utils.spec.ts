import { EmbeddedConfig, getEmbeddedConfig } from '../../environments/embedded-config';

export const changeEmbeddedConfig = (newConfig: EmbeddedConfig) => (window as any).CS_EMBEDDED_CONFIG = newConfig;

export const setClusterName = (clusterName: EmbeddedConfig['clusterName']) =>
  changeEmbeddedConfig({...getEmbeddedConfig(), clusterName});
