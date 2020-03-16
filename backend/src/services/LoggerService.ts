//  tslint:disable:no-console
class Logger {
  public info(message: string): void {
    console.info(`[INFO] ${message}`);
  }

  public debug(message: string): void {
    console.debug(`[DEBUG] ${message}`);
  }

  public warn(message: string): void {
    console.warn(`[WARN] ${message}`);
  }

  public error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

const logger = new Logger();

export = logger;
