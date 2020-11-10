import fs = require('fs');

class AppConfiguration {
  private static _loaded = false;
  private static _dataCloudHost: string;
  private static _listenPort: number;
  private static _mode: 'test' | 'development' | 'production';
  private static _portalClientId: string;
  private static _docsUrl: string;
  private static _directoryService: string;
  private static _logLevel: string;

  public static get dataCloudHost(): string {
    return this._dataCloudHost;
  }

  public static get listenPort(): number {
    return this._listenPort;
  }

  public static get mode(): 'test' | 'development' | 'production' {
    return this._mode;
  }

  public static get portalClientId(): string {
    return this._portalClientId;
  }

  public static get directoryService(): string {
    return this._directoryService;
  }

  public static get logLevel(): string {
    return this._logLevel;
  }

  public static loadFromFile(filepath: string): void {
    if (AppConfiguration._loaded) {
      throw new Error('configuration already loaded.');
    }
    let content = fs.readFileSync(filepath).toString();
    let config = JSON.parse(content);
    AppConfiguration.loadFromObject(config);
  }

  public static loadFromObject(config: any): void {
    AppConfiguration._dataCloudHost = config.dataCloudHost;
    AppConfiguration._directoryService = config.directoryService;
    AppConfiguration._listenPort = config.listenPort;
    AppConfiguration._mode = config.mode;
    AppConfiguration._loaded = true;
    AppConfiguration._portalClientId = config.portalClientId || 'PARTNER_PORTAL';
    AppConfiguration._docsUrl = config.docsUrl;
    AppConfiguration._logLevel = config.logLevel || 'info';
  }
}

export = AppConfiguration;
