import { UserData } from '@modules/common/types';
import * as request from 'request-promise-native';
import { SkillCertificateDao } from '@modules/data-access/daos/SkillCertificateDao';
import { NewSkillCertificate } from '@modules/data-access/models/SkillCertificate';

export class SkillCertificatesService {
  public static download(userData: UserData, technicianId: string, skillId: string): request.RequestPromise {
    return SkillCertificateDao.downloadDocument(userData, technicianId, skillId);
  }

  public static uploadAll(
    userData: UserData,
    technicianExternalId: string,
    certificates: NewSkillCertificate[],
    viewModelIdToSkillIdMap: { [key: string]: string },
  ): Promise<any> {
    return Promise.all([
      ...certificates.map(certificate => {
        const skillId = certificate.skillId ? certificate.skillId : viewModelIdToSkillIdMap[certificate.viewModelId];
        return SkillCertificateDao.uploadDocument(userData, technicianExternalId, skillId, certificate);
      }),
    ]);
  }

}
