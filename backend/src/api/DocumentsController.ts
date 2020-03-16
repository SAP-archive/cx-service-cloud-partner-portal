import * as express from 'express';
import { UserDataRequest } from './middleware/sessiondata';
import { DocumentsService } from '../services/DocumentsService';
import { ApiHelper } from './APIHelper';

export class DocumentsController {
  public static download(req: express.Request & UserDataRequest, res: express.Response) {
    const {userData} = req;
    DocumentsService.download(userData, req.param('id'))
    .on('error', () => ApiHelper.processError(res))
    .pipe(res);
  }
}
