import logger = require('./LoggerService');

export class VaultService {

  public static PROMETHEUS_USERNAME: string;
  public static PROMETHEUS_PASSWORD: string;
  public static CLIENT_ID: string;
  public static CLIENT_SECRET: string;

  public static initializeEnvVars() {
    const missingVars = [];
    const loadVar: Function = ((list: string[]) => (variableName) => {
      const value = process.env[variableName];
      if (value) {
        VaultService[variableName] = value;
      } else {
        list.push(variableName);
      }
    })(missingVars);

    loadVar('PROMETHEUS_USERNAME');
    loadVar('PROMETHEUS_PASSWORD');
    loadVar('CLIENT_ID');
    loadVar('CLIENT_SECRET');

    if (missingVars.length > 0) {
      missingVars.forEach(envVar => {
        logger.error(`MISSING ENV VAR: ${envVar}`);
      });
      process.exit(1);
    }
  }
}
