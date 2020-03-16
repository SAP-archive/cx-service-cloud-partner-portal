import { UserData } from '@modules/common/types';
import { HttpClientService } from '@modules/data-access';
import { CloudStorageItem } from '../../../models/CloudStorageItem';

export class CloudStorageItemDao {
  public static async findValueByKey(userData: UserData, key: string): Promise<CloudStorageItem> {
    return HttpClientService.send<{ data: string, version: number }>({
      method: 'GET',
      path: `/api/master/v1/userSettings/${key}`,
      userData,
    });
  }

  public static setValue(userData: UserData, key: string, item: CloudStorageItem): Promise<CloudStorageItem> {
    return HttpClientService.send<{ data: string, version: number }>({
      method: 'POST',
      path: `/api/master/v1/userSettings/${key}`,
      userData,
      data: item,
    });
  }
}
