import { UserData } from '@modules/common/types';
import { DataApiService } from '@modules/data-access';
import { CompanySettingsDto } from '@modules/data-access/dtos/CompanySettingsDto';

export class CompanySettingsDao {
  public static async fetch(userData: UserData): Promise<CompanySettingsDto> {
    return DataApiService.download<{ settings: CompanySettingsDto }>(userData, 'CompanySettings')
      .then(response => response.settings);
  }
}
