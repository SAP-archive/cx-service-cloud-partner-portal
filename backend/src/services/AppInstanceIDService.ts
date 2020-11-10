import { UUIDFactory } from './UUIDFactory';

class AppInstanceIDService {
  private static instanceID: string;
  private static instance: AppInstanceIDService;

  private constructor() {
    AppInstanceIDService.instanceID = UUIDFactory.createUUID();
  }

  public static getInstance(): AppInstanceIDService {
    if (!AppInstanceIDService.instance) {
      AppInstanceIDService.instance = new AppInstanceIDService();
    }

    return AppInstanceIDService.instance;
  }

  public getAppInstanceID(): string {
    return AppInstanceIDService.instanceID;
  }
}

export { AppInstanceIDService };
