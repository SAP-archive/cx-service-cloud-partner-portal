import { ILogger } from '../model/ILogger';

export class FileReader {

  constructor(private logger: Readonly<ILogger>) {
  }

  public tryReadJsonFile<T>(path: string, logError: boolean = true): T {
    try {
      return (require as Function)(path);
    } catch (ex) {
      if (logError) {
        this.logger.error(ex);
      }
      return null;
    }
  }
}
