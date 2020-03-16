import { Tag } from '../models/Tag';
import { UserData } from '@modules/common/types';
import { CrowdServiceApi } from '../services/CrowdServiceApi';

export class TagDao {
  public static async getAll(userData: UserData): Promise<Tag[]> {
    return CrowdServiceApi.get<Tag>(userData, `crowd-partner/v1/tags`)
      .then(response => response.results);
  }
}
