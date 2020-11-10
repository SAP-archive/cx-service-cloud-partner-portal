import { UserData } from '@modules/common/types';
import { BusinessPartnerDao } from '@modules/data-access/daos/BusinessPartnerDao';

export class BusinessPartnerService {
  public static async terminateCrowdPartner(userData: UserData, partnerId: string): Promise<any> {
    return BusinessPartnerDao.terminateGet(userData, partnerId);
  }
}
