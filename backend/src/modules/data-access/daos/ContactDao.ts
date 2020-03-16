import { UserData } from '@modules/common/types';
import { CrowdServiceApi } from '@modules/data-access/services/CrowdServiceApi';
import { Contact } from '../../../models/Contact';

export class ContactDao {
  public static async findByPartnerId(userData: UserData, partnerId: string): Promise<Contact> | undefined {
    return CrowdServiceApi.get<Contact>(userData, `crowd-partner/v1/partners/${partnerId}/contacts`)
      .then((contactsResponse) =>
        contactsResponse.results.find(contact => contact.role === 'PARTNER_ADMIN'));
  }
}
