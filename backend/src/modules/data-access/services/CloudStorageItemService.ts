import { CloudStorageItemDao } from '@modules/data-access/daos/CloudStorageItemDao';
import { UserData } from '@modules/common/types';
import { CloudStorageItem } from '../../../models/CloudStorageItem';

export class CloudStorageItemService {
  public static async findValueByKey(userData: UserData, key: string): Promise<string | undefined> {
    return CloudStorageItemDao.findValueByKey(userData, key)
      .then(response => response ? response.data : undefined);
  }

  public static setValue(userData: UserData, key: string, item: CloudStorageItem): Promise<CloudStorageItem> {
    return CloudStorageItemDao.setValue(userData, key, item);
  }
}
