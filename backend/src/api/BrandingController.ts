import * as express from 'express';
import { UserDataRequest } from './middleware/sessiondata';
import { BrandingService } from  '../services/BrandingService';
import { ApiHelper, StatusCode } from './APIHelper';

export class BrandingController {
  public static async getCrowdOwnerContact(req: express.Request & UserDataRequest, res: express.Response) {
    BrandingService.getCrowdOwnerContact(req.userData)
      .then(settings => {
        res.send(settings);
      })
      .catch(error => ApiHelper.processError(res, error));
  }

  public static async getCrowdOwnerName(req: express.Request & UserDataRequest, res: express.Response) {
    BrandingService.getCrowdOwnerName(req.userData)
      .then(crowdName => res.send({crowdName}))
      .catch(error => {
        if (error.statusCode === StatusCode.NOT_FOUND) {
          res.sendStatus(StatusCode.NOT_FOUND);
          return;
        }

        ApiHelper.processError(res, error);
      });
  }

  public static async getLogo(req: express.Request & UserDataRequest, res: express.Response) {
    BrandingService.getLogo(req.userData)
      .then(logoString => res.send({logoString}))
      .catch(error => {
        if (error.statusCode === StatusCode.NOT_FOUND) {
          res.sendStatus(StatusCode.NOT_FOUND);
          return;
        }

        ApiHelper.processError(res, error);
      });
  }
}
