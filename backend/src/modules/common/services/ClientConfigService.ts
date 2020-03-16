import { ClientConfiguration } from '../types/ClientConfiguration';

class ClientConfigService {
  private config: ClientConfiguration;

  public getConfig(): ClientConfiguration {
    if (!this.config) {
      throw new Error('Client configuration not available!');
    }

    return this.config;
  }

  public setConfig(config: ClientConfiguration) {
    this.config = config;
  }
}

export const clientConfigService = new ClientConfigService();
