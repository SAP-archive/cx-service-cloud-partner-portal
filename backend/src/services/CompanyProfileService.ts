import { UserData } from '@modules/common/types';
import { AddressDao } from '@modules/data-access/daos/AddressDao';
import { ContactDao } from '@modules/data-access/daos/ContactDao';
import { CompanyProfileDao } from '@modules/data-access/daos/CompanyProfileDao';
import { BusinessPartnerDao } from '@modules/data-access/daos/BusinessPartnerDao';
import { DocumentsDao } from '@modules/data-access/daos/DocumentsDao';
import { CompanyProfile } from '../models/CompanyProfile';
import { SaveCompanyProfileData } from '../models/SaveCompanyProfileData';
import { DocumentsService } from './DocumentsService';
import { ServiceAreaDao } from '@modules/data-access/daos/ServiceAreaDao';
import { omit } from '../utils/omit';
import { CompanyDetails } from '../models/CompanyDetails';

export class CompanyProfileService {
  public static read(userData: UserData, partnerId: string): Promise<CompanyProfile> {
    return Promise.all([
      BusinessPartnerDao.findById(userData, partnerId),
      AddressDao.findByPartnerId(userData, partnerId),
      ContactDao.findByPartnerId(userData, partnerId),
      ServiceAreaDao.findByPartnerId(userData, partnerId),
      DocumentsDao.fetchMyDocuments(userData),
    ])
      .then(([businessPartner, address, contact, serviceArea, documents]) => {
        return {
          companyDetails: {
            ...businessPartner,
            contact,
            address,
            serviceArea,
          },
          documents,
        };
      });
  }

  public static save(userData: UserData, partnerId: string, saveProfileData: SaveCompanyProfileData): Promise<CompanyProfile> {
    return Promise.all([
      CompanyProfileDao.save(userData, partnerId, saveProfileData.companyDetails),
      Promise.all([
        DocumentsService.removeDocuments(userData, saveProfileData.removedDocumentsIds),
        DocumentsService.addDocuments(userData, partnerId, saveProfileData.newDocuments),
      ])
        .then(() => DocumentsDao.fetchMyDocuments(userData)),
    ])
      .then(([companyDetails, documents]) => {
        return {
          companyDetails: omit(companyDetails as any, 'code', 'createDateTime') as CompanyDetails,
          documents,
        };
      });
  }
}
