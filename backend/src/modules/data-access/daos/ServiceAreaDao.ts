import { UserData } from '@modules/common/types';
import { CrowdServiceApi } from '@modules/data-access/services/CrowdServiceApi';
import { emptyServiceArea, ServiceArea } from '../../../models/ServiceArea';
import { omit } from '../../../utils/omit';

export class ServiceAreaDao {
  public static async findByPartnerId(userData: UserData, partnerId: string): Promise<ServiceArea> | undefined {
    return CrowdServiceApi.get<ServiceArea>(userData, `crowd-partner/v1/partners/${partnerId}/service-areas`)
      .then(({results}) =>
        results.length > 0 ? omit(results[0], 'id') as ServiceArea : emptyServiceArea()
      );
  }
}
