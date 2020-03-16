export interface EmbeddedConfig {
  clusterName: string;
}

export const getEmbeddedConfig = () => CS_EMBEDDED_CONFIG as EmbeddedConfig;
