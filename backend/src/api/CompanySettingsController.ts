import * as express from 'express';
import { UserDataRequest } from './middleware/sessiondata';
import { ApiHelper } from './APIHelper';
import { CompanySettingsDao } from '@modules/data-access/daos/CompanySettingsDao';

export class CompanySettingsController {
  public static async fetch(req: express.Request & UserDataRequest, res: express.Response) {
    CompanySettingsDao.fetch(req.userData)
      .then(settings => res.send(settings))
      .catch(error => ApiHelper.processError(res, error));
  }
}
