import { BarndingSettingDao } from '@modules/data-access/daos/BrandingDao';
import { UserData } from '@modules/common/types';
import { BrandingSettingKey } from '@modules/data-access/types/BrandingSettingKey';

export interface CrowdOwnerContactInfo {
  name: string;
  emailAddress: string;
  phoneNumber:  string;
}

export class BrandingService {
  public static async getCrowdOwnerContact(userData: UserData): Promise<CrowdOwnerContactInfo> {
    return BarndingSettingDao.readAll(userData).then(settings => {
      const getSetting = (keyName: BrandingSettingKey): string =>
        settings.find(setting => setting.key === keyName)?.value;

      return {
        name: getSetting('CrowdOwner.Contact.Name'),
        emailAddress: getSetting('CrowdOwner.Contact.EMail'),
        phoneNumber: getSetting('CrowdOwner.Contact.PhoneNumber'),
      };
    });
  }

  public static async getLogo(userData: UserData): Promise<string> {
    return BarndingSettingDao.get(userData, 'CrowdOwner.Logo')
      .then(setting => setting.value);
  }
}
