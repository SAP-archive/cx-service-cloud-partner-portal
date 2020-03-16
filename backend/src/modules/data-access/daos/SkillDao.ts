import { UserData } from '@modules/common/types';
import { CrowdServiceApi, CrowdServiceResponse } from '@modules/data-access/services/CrowdServiceApi';
import { Skill } from '../models';

export class SkillDao {
  public static getAll(
    userData: UserData,
    technicianExternalId: string,
  ): Promise<Skill[]> {
    return CrowdServiceApi.get<Skill>(userData, `/crowd/v2/technicians/${technicianExternalId}/skills`)
      .then(response => response.results);
  }
}
