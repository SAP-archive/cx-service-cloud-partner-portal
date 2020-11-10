import * as express from 'express';
import { ApiHelper } from './APIHelper';
import { UserDataRequest } from './middleware/sessiondata';
import { BusinessPartnerService } from '../services/BusinessPartnerService';

export class BusinessPartnerController {
  public static terminateCrowdPartner(req: express.Request & UserDataRequest, res: express.Response) {
    const { partnerId } = req.params;
    return BusinessPartnerService.terminateCrowdPartner(req.userData, partnerId)
      .then(result => res.json(result))
      .catch(error => ApiHelper.processError(res, error));
  }

}
