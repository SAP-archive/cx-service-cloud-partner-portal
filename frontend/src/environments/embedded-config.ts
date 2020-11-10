export interface EmbeddedConfig {
  clusterName: string;
  launchdarklyKey: string;
}

export const getEmbeddedConfig = () => CS_EMBEDDED_CONFIG as EmbeddedConfig;
