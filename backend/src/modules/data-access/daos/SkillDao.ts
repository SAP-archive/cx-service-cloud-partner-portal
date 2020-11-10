import { UserData } from '@modules/common/types';
import { CrowdServiceApi, CrowdServiceResponse } from '@modules/data-access/services/CrowdServiceApi';
import { Skill } from '../models';

export class SkillDao {
  public static getByPage(userData: UserData, technicianExternalId: string, page: number, size: number): Promise<CrowdServiceResponse<Skill>> {
    return CrowdServiceApi.get<Skill>(userData, `/crowd/v2/technicians/${technicianExternalId}/skills`, { page, size });
  }
}
