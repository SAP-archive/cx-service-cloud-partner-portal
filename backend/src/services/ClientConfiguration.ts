export interface IBaseClientConfiguration {
  directoryService: string;
  clusterName: string;
  enableClusterRedirect: boolean;
  cnIcpNumber: string;
  launchdarklyKey: string;
}

class ClientConfiguration {
  private static readonly DIRECTORY_SERVICE_KEY = 'CLIENT_DIRECTORY_SERVICE';
  private static readonly APP_CLUSTER_KEY = 'CLIENT_APP_CLUSTER';
  private static readonly ENABLE_CLUSTER_REDIRECT_KEY = 'CLIENT_ENABLE_CLUSTER_REDIRECT';
  private static readonly CN_ICP_NUMBER_KEY = 'CN_ICP_NUMBER';
  private static readonly LAUNCH_DARKLY_KEY = 'LAUNCH_DARKLY_KEY';

  private configProvided: boolean;
  private config: NodeJS.ProcessEnv | undefined;

  constructor() {
    this.configProvided = false;
  }

  public get directoryService() {
    return this.getProperty(ClientConfiguration.DIRECTORY_SERVICE_KEY);
  }

  public get clusterName() {
    return this.getProperty(ClientConfiguration.APP_CLUSTER_KEY);
  }

  public get enableClusterRedirect(): boolean {
    try {
      return JSON.parse(this.getProperty(ClientConfiguration.ENABLE_CLUSTER_REDIRECT_KEY));
    } catch (error) {
      return false;
    }
  }

  public get cnIcpNumber() {
    return this.getProperty(ClientConfiguration.CN_ICP_NUMBER_KEY);
  }

  public get launchdarklyKey() {
    return this.getProperty(ClientConfiguration.LAUNCH_DARKLY_KEY);
  }

  public setConfiguration(env: NodeJS.ProcessEnv) {
    this.config = env;
    this.configProvided = true;
  }

  public getConfiguration(): IBaseClientConfiguration {
    return {
      directoryService: this.directoryService,
      clusterName: this.clusterName || '',
      enableClusterRedirect: this.enableClusterRedirect,
      cnIcpNumber: this.cnIcpNumber,
      launchdarklyKey: this.launchdarklyKey,
    };
  }

  protected getProperty(key: string, throwIfMissing: boolean = false): string {
    if (!this.configProvided) {
      throw new Error('Client configuration wasn\'t provided');
    }
    if (this.config[key] === undefined && throwIfMissing) {
      throw new Error(`Client configuration key not provided: ${key}`);
    }
    return this.config[key];
  }
}

const clientConfiguration = new ClientConfiguration();

export { clientConfiguration };
