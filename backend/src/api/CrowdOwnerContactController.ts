
import * as express from 'express';
import { UserDataRequest } from './middleware/sessiondata';
import { ApiHelper } from './APIHelper';
import { CrowdOwnerContactService } from '../services/CrowdOwnerContactService';

export class CrowdOwnerContactController {
  public static getContact(req: express.Request & UserDataRequest, res: express.Response) {
    return CrowdOwnerContactService.getContact(req.userData)
      .then(result => res.json(result))
      .catch((error) => ApiHelper.processError(res, error));
  }
}
