import * as express from 'express';
import { ApiHelper, StatusCode } from './APIHelper';
import { UserDataRequest } from './middleware/sessiondata';
import { CompanyProfileService } from '../services/CompanyProfileService';
import { UnifiedPersonDao } from '@modules/data-access/daos';
import { SaveCompanyProfileData } from '../models/SaveCompanyProfileData';
import { validateBody } from '@modules/common/utils';
import { companyDetailsSchema } from '../models/CompanyDetails';
import { newDocumentSchema } from '../models/NewDocument';

interface SaveCompanyProfileRequest extends express.Request {
  body: SaveCompanyProfileData;
}

export class CompanyProfileController {
  public static read(req: express.Request & UserDataRequest, res: express.Response) {
    const {userData} = req;

    return CompanyProfileService.read(userData)
      .then(result => res.json(result))
      .catch((error) => ApiHelper.processError(res, error));
  }

  @validateBody({
    schema: {
      type: 'object',
      additionalItems: false,
      properties: {
        companyDetails: {$ref: '/CompanyDetails'},
        newDocuments: {
          type: 'array',
          items: {$ref: '/NewDocument'},
        },
        removedDocumentsIds: {
          type: 'array',
          items: {type: 'string'},
        },
      },
      required: [
        'companyDetails',
        'newDocuments',
        'removedDocumentsIds',
      ],
    },
    referencedSchemas: [companyDetailsSchema, newDocumentSchema],
  })
  public static save(req: SaveCompanyProfileRequest & UserDataRequest, res: express.Response) {
    const {userData, body} = req;

    UnifiedPersonDao.findPartnerIdForCurrentUser(userData)
      .then(partnerId => CompanyProfileService.save(userData, partnerId, body))
      .then(result => res.json(result))
      .catch((error) => ApiHelper.processError(res, error));
  }
}
