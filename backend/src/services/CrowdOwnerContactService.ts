import { UserData } from '../modules/common/types';
import { PartnerContactDao } from '../modules/data-access/daos/PartnerContactDao';
import { CrowdOwnerContactInfo, emptyCrowdOwnerContactInfo } from './BrandingService';

export class CrowdOwnerContactService {
  public static async getContact(userData: UserData): Promise<CrowdOwnerContactInfo> {
    const contact = await PartnerContactDao.getContact(userData);
    if (contact) {
      return {
        name: [contact.firstName, contact.lastName].filter(str => !!str).join(' ').trim(),
        emailAddress: contact.emailAddress,
        phoneNumber: contact.officePhone
      } as CrowdOwnerContactInfo;
    } else {
      return emptyCrowdOwnerContactInfo();
    }
  }

}
