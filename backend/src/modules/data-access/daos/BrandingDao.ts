import { CrowdBrandingApiService, BrandingServiceResponse } from '../services/CrowdBrandingApiService';
import { UserData } from '@modules/common/types';
import { BrandingSetting } from '../models/BrandingSetting';
import { BrandingSettingKey } from '../types/BrandingSettingKey';

export class BrandingSettingDao {

  public static getByPage(userData: UserData, page: number, size: number): Promise<BrandingServiceResponse<BrandingSetting>> {
    return CrowdBrandingApiService.get<BrandingServiceResponse<BrandingSetting>>(userData, 'branding/v1/settings', { page, size })
      .then((response) => ({
        ...response,
        results: Array.isArray(response.results) ? response.results : [response.results]
      }));
  }

  public static async get(userData: UserData, settingKey: BrandingSettingKey): Promise<BrandingSetting> {
    return CrowdBrandingApiService.get<BrandingSetting>(userData, `branding/v1/settings/${settingKey}`);
  }
}
