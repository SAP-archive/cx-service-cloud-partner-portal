import { Tag } from '../models/Tag';
import { UserData } from '@modules/common/types';
import { CrowdServiceApi, CrowdServiceResponse } from '../services/CrowdServiceApi';

export class TagDao {
  public static getByPage(userData: UserData, page: number, size: number): Promise<CrowdServiceResponse<Tag>> {
    return CrowdServiceApi.get<Tag>(userData, `crowd-partner/v1/tags`, {page, size});
  }
}
