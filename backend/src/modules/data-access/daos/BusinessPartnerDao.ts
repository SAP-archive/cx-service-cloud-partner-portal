import { UserData } from '@modules/common/types';
import { DataApiService } from '@modules/data-access';
import { BusinessPartnerDto } from '@modules/data-access/dtos/BusinessPartnerDto';

export class BusinessPartnerDao {
  public static async findById(userData: UserData, id: string): Promise<BusinessPartnerDto> | undefined {
    return DataApiService.findById<BusinessPartnerDto | any>(userData, 'BusinessPartner', id)
      .then(entry => !!entry ? {
        id: entry.id,
        name: entry.name,
        remarks: entry.remarks,
        inactive: entry.inactive,
      } : undefined);
  }
}
