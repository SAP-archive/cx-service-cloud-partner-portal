import { UserData } from '@modules/common/types';
import { CrowdServiceApi } from '@modules/data-access/services/CrowdServiceApi';
import { PartnerGroup } from '../models/PartnerGroup';

export class PartnerGroupDao {
  public static getByPartnerId(userData: UserData, id: string): Promise<PartnerGroup> {
    return CrowdServiceApi.get<PartnerGroup>(userData, `/crowd-partner/v1/partner-groups?partnerId=${id}`)
      .then(response => response.results ? response.results[0] : null);
  }
}
