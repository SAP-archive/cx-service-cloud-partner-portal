import { UserData } from '@modules/common/types';
import { CompanyProfileDao } from '@modules/data-access/daos/CompanyProfileDao';
import { DocumentsDao } from '@modules/data-access/daos/DocumentsDao';
import { CompanyProfile } from '../models/CompanyProfile';
import { SaveCompanyProfileData } from '../models/SaveCompanyProfileData';
import { DocumentsService } from './DocumentsService';
import { omit } from '../utils/omit';
import { CompanyDetails } from '../models/CompanyDetails';
import { emptyServiceArea } from '../models/ServiceArea';

export class CompanyProfileService {
  public static read(userData: UserData): Promise<CompanyProfile> {
    return Promise.all([
      CompanyProfileDao.get(userData),
      DocumentsDao.fetchMyDocuments(userData),
    ])
      .then(([companyDetails, documents]) => {
        return {
          companyDetails: {
            ...companyDetails,
            serviceArea: companyDetails.serviceArea ? companyDetails.serviceArea : emptyServiceArea()
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
