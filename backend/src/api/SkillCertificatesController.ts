import * as express from 'express';
import { UserDataRequest } from './middleware/sessiondata';
import { ApiHelper, StatusCode } from './APIHelper';
import { SkillCertificatesService } from '../services/SkillCertificatesService';

export class SkillCertificatesController {
  public static download(req: express.Request & UserDataRequest, res: express.Response) {
    const {technicianId, skillId} = req.params;
    const download = SkillCertificatesService.download(req.userData, technicianId, skillId);
    download.catch(() => undefined);
    download.on('error', () => ApiHelper.processError(res))
      .pipe(res);
  }
}
