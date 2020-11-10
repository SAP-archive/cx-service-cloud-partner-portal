import { UserData } from '@modules/common/types';
import { CrowdServiceApi, CrowdServiceResponse } from '@modules/data-access/services/CrowdServiceApi';

export class BusinessPartnerDao {

  public static async terminateGet(userData: UserData, partnerId: string, ): Promise<CrowdServiceResponse<undefined>> {
    return CrowdServiceApi.get<undefined>(userData,
      `crowd-partner/v1/partners/${partnerId}/actions/terminate`);
  }

}
