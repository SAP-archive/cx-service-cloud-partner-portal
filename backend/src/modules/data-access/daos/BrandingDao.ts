import { CrowdBrandingApiService } from '../services/CrowdBrandingApiService';
import { UserData } from '@modules/common/types';
import { BrandingSetting } from '../models/BrandingSetting';
import { BrandingSettingKey } from '../types/BrandingSettingKey';

export class BarndingSettingDao {
  public static readAll(userData: UserData): Promise<BrandingSetting[]> {
    return CrowdBrandingApiService.getAll<BrandingSetting>(userData, 'branding/v1/settings')
      .then(({results}) => {
        /**
         * Due to a misconfiguration in the Branding API, we need to
         * handle the case of `results` containing only an object and
         * not an array of elements.
         *
         * This workaround can be removed after  CPB-43960 was done.
         */
        if (Array.isArray(results)) {
          return results;
        }

        return [results];
      });
  }

  public static async get(userData: UserData, settingKey: BrandingSettingKey): Promise<BrandingSetting> {
    return CrowdBrandingApiService.get<BrandingSetting>(userData, `branding/v1/settings/${settingKey}`);
  }
}
