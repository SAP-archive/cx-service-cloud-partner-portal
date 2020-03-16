import { UserData } from '@modules/common/types';
import { CrowdServiceApi } from '@modules/data-access/services/CrowdServiceApi';
import { Address } from '../../../models/Address';

export class AddressDao {
  public static async findByPartnerId(userData: UserData, partnerId: string): Promise<Address> | undefined {
    return CrowdServiceApi.get<Address>(userData, `crowd-partner/v1/partners/${partnerId}/addresses`).then((addressesResponse) => {
      return addressesResponse.results.length > 0 ? addressesResponse.results[0] : null;
    });
  }
}
