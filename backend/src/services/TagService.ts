import { TagDao } from '@modules/data-access/daos';
import { Tag } from '@modules/data-access/models';
import { UserData } from '@modules/common/types';

export class TagService {
  public static async getAll(userData: UserData): Promise<Tag[]> {
    return TagDao.getAll(userData);
  }
}
