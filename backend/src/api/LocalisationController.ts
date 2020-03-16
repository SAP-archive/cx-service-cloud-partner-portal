import * as express from 'express';
import { ApiHelper } from './APIHelper';
import { UserDataRequest } from './middleware/sessiondata';
import { CloudStorageItemService } from '@modules/data-access/services/CloudStorageItemService';
import { validateBody } from '@modules/common/utils';

interface SetLocalisationRequest extends express.Request {
  body: { code: string, language: string };
}

export class LocalisationController {
  @validateBody({
    schema: {
      type: 'object',
      additionalItems: false,
      properties: {
        code: {type: 'string'},
        language: {type: 'string'},
      },
      required: [
        'code',
        'language',
      ],
    },
  })
  public static setLocalisation(req: SetLocalisationRequest & UserDataRequest, res: express.Response) {
    const {userData, body} = req;
    Promise.all([
      CloudStorageItemService.setValue(userData, 'Cockpit_SelectedLocale', {data: body.code, version: 1}),
      CloudStorageItemService.setValue(userData, 'Cockpit_SelectedLanguage', {data: body.language, version: 1}),
    ])
      .then(result => res.json(result))
      .catch(() => ApiHelper.processError(res));
  }
}
