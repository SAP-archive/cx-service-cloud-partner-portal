import { UserData } from '@modules/common/types';
import { CrowdServiceApi } from '@modules/data-access/services/CrowdServiceApi';
import * as request from 'request-promise-native';
import { HttpClientService } from '../services';
import { NewSkillCertificate } from '../models/SkillCertificate';
import { SkillDto } from '../dtos';

export class SkillCertificateDao {
  public static downloadDocument(userData: UserData, technicianId: string, skillId: string): request.RequestPromise {
    return CrowdServiceApi.stream(userData, `/crowd/v2/technicians/${technicianId}/skills/${skillId}/certificates/attachments`);
  }

  public static uploadDocument(
    userData: UserData,
    technicianExternalId: string,
    skillUUID: string,
    certificate: NewSkillCertificate,
  ): Promise<string[]> {
    const formData = {
      file: {
        value: Buffer.from(certificate.fileContents, 'base64'),
        options: {
          filename: certificate.fileName,
          contentType: certificate.contentType,
        },
      },
    };

    return HttpClientService.send<string[]>({
      method: 'POST',
      path: `/cloud-crowd-service/api/crowd/v2/technicians/${technicianExternalId}/skills/${skillUUID}/certificates`,
      data: formData,
      useFormData: true,
      userData,
    });
  }
}
