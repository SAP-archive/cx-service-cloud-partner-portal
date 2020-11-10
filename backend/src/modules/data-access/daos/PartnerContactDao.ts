import { UserData } from '@modules/common/types';
import { CrowdServiceApi } from '@modules/data-access/services/CrowdServiceApi';
import { PartnerContact } from '../models/PartnerContact';

export class PartnerContactDao {
  public static getContact(userData: UserData): Promise<PartnerContact> {
    return CrowdServiceApi.get<PartnerContact>(userData, `/crowd-partner/v1/partner-contacts`)
      .then(response => response.results ? response.results[0] : null);
  }
}
