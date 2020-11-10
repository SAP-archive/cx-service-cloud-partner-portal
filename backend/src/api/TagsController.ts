import * as express from 'express';
import { ApiHelper } from './APIHelper';
import { UserDataRequest } from './middleware/sessiondata';
import { TagService } from '../services/TagService';

export class TagsController {
  public static readAll(req: express.Request & UserDataRequest, res: express.Response) {
    TagService.getAll(req.userData)
      .then(result => res.json(result))
      .catch((error) => ApiHelper.processError(res, error));
  }
}
