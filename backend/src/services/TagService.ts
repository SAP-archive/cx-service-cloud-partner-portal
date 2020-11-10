import { TagDao } from '@modules/data-access/daos';
import { Tag } from '@modules/data-access/models';
import { UserData } from '@modules/common/types';
import { CrowdServiceResponse } from '../modules/data-access/services/CrowdServiceApi';

export class TagService {
  public static async getAll(userData: UserData): Promise<Tag[]> {
    return TagService.fetchTags(userData, 0, 1000)
      .then(response => response.results);
  }

  public static fetchTags(userData: UserData, page: number, size: number): Promise<CrowdServiceResponse<Tag>> {
    return TagDao.getByPage(userData, page, size);
  }
}
