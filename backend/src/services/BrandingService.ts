import { BrandingSettingDao } from '@modules/data-access/daos/BrandingDao';
import { UserData } from '@modules/common/types';
import { BrandingSettingKey } from '../modules/data-access/types/BrandingSettingKey';

export interface CrowdOwnerContactInfo {
  name: string;
  emailAddress: string;
  phoneNumber: string;
}

export const emptyCrowdOwnerContactInfo = (): CrowdOwnerContactInfo => ({
  name: '',
  emailAddress: '',
  phoneNumber: '',
});

export class BrandingService {

  public static getSettingValue(userData: UserData, settingKey: BrandingSettingKey, defaultValue: any = undefined): Promise<any | undefined> {
    return BrandingSettingDao.get(userData, settingKey)
      .then(setting => {
        if (setting.type !== 'CLOUD_IDENTIFIER' && Array.isArray(setting.value)) {
          return '';
        }
        return setting.value;
      })
      .catch(() => defaultValue);
  }

  public static async getCrowdOwnerContact(userData: UserData): Promise<CrowdOwnerContactInfo> {
    return Promise.all([
      BrandingService.getSettingValue(userData, 'CrowdOwner.Contact.Name', ''),
      BrandingService.getSettingValue(userData, 'CrowdOwner.Contact.EMail', ''),
      BrandingService.getSettingValue(userData, 'CrowdOwner.Contact.PhoneNumber', ''),
    ]).then(([name, emailAddress, phoneNumber]) => ({
      name,
      emailAddress,
      phoneNumber,
    }));
  }

  public static async getLogo(userData: UserData): Promise<string> {
    return BrandingService.getSettingValue(userData, 'CrowdOwner.Logo');
  }

  public static async getCrowdOwnerName(userData: UserData): Promise<string> {
    return BrandingService.getSettingValue(userData, 'CrowdOwner.About.Title');
  }
}
