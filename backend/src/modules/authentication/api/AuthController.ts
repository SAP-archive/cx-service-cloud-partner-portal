import * as express from 'express';
import { AuthService } from '../services/AuthService';
import { SessionDataFactory } from '../services/SessionDataFactory';
import { validateBody } from '@modules/common/utils';
import { UserDataRequest } from 'api/middleware/sessiondata';
import { UnifiedPersonDao } from '@modules/data-access/daos';
import { UserData } from '@modules/common/types';
import { UnifiedPerson } from 'models/UnifiedPerson';
import { OAuthLoginResponse } from '../types';
import { CloudStorageItemService } from '@modules/data-access/services/CloudStorageItemService';
import { ProfileObjectService } from '../../../services/ProfileObjectService';

interface LoginRequest extends express.Request {
  body: {
    accountName: string;
    userName: string;
    password: string;
  };
}

interface ChangePasswordRequest extends express.Request {
  body: {
    accountName: string;
    userName: string;
    oldPassword: string;
    newPassword: string;
  };
}

export class AuthController {
  @validateBody({
    schema: {
      type: 'object',
      properties: {
        accountName: {
          type: 'string',
        },
        userName: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
      required: [
        'accountName',
        'userName',
        'password',
      ],
    },
  })
  public static async login(req: LoginRequest, res: express.Response): Promise<void> {
    const {accountName, userName, password} = req.body;
    AuthService.login({accountName: accountName, userName: userName, password})
      .then(async loginResponse =>
        Promise.all([
          loginResponse,
          AuthController.getPersonForUser(loginResponse),
          CloudStorageItemService.findValueByKey(SessionDataFactory.create(loginResponse), 'Cockpit_SelectedLocale'),
          ProfileObjectService.readMaxAttachmentSize(SessionDataFactory.create(loginResponse)),
          AuthController.getPartnerIdForCurrentUser(loginResponse),
        ]))
      .then(([loginResponse, person, localeCode, maxAttachmentSize, partnerId]: [OAuthLoginResponse, UnifiedPerson, string, number, string]) => {
        if (partnerId) {
          res.json({
            authData: SessionDataFactory.create(loginResponse),
            person,
            localeCode,
            maxAttachmentSize,
          });
        } else {
          res.status(401);
          res.json({error: 'ERROR_PP_NOT_ALLOWED'});
        }
      })
      .catch((error) => {
        if (error.statusCode === 400 && JSON.parse(error.response.body).error === 'expired_credentials') {
          res.status(200);
          res.json({passwordNeedsToBeChanged: true});
        } else {
          res.status(500);
          res.json({error: 'LOGIN_FAILED'});
        }
      });
  }

  @validateBody({
    schema: {
      type: 'object',
      properties: {
        accountName: {
          type: 'string',
        },
        userName: {
          type: 'string',
        },
        oldPassword: {
          type: 'string',
        },
        newPassword: {
          type: 'string',
        },
      },
      required: [
        'accountName',
        'userName',
        'oldPassword',
        'newPassword',
      ],
    },
  })
  public static changePassword(req: ChangePasswordRequest, res: express.Response): void {
    AuthService.changePassword(req.body).then(() => {
      res.send(undefined);
    }).catch(() => {
      res.status(500);
      res.json({error: 'PASSWORD_CHANGE_FAILED'});
    });
  }

  public static logout(req: LoginRequest & UserDataRequest, res: express.Response, next: () => void): void {
    const token = req.userData.authToken.split(' ')[1];
    if (!token) {
      res.status(500);
      res.json({error: 'ERROR_INVALID_TOKEN'});
      next();
      return;
    }

    AuthService.logout(token).then(() => {
      res.send(undefined);
    }).catch(() => {
      res.status(500);
      res.json({error: 'ERROR_WHILE_LOGGING_OUT'});
    });
  }

  private static resolveUserDataFromLoginResponse (loginResponse: OAuthLoginResponse): UserData {
    const [company] = loginResponse.companies;
    const userData: UserData = {
      accountName: loginResponse.account,
      accountId: loginResponse.account_id.toString(10),
      companyName: company.name,
      companyId: company.id.toString(10),
      userName: loginResponse.user,
      userId: loginResponse.user_id.toString(10),
      authToken: `${loginResponse.token_type} ${loginResponse.access_token}`,
    };
    return userData;
  }

  private static async getPersonForUser(loginResponse: OAuthLoginResponse): Promise<UnifiedPerson> {
    return UnifiedPersonDao.findForCurrentUser(this.resolveUserDataFromLoginResponse(loginResponse));
  }

  private static async getPartnerIdForCurrentUser(loginResponse: OAuthLoginResponse): Promise<String> {
    return UnifiedPersonDao.findPartnerIdForCurrentUser(this.resolveUserDataFromLoginResponse(loginResponse));
  }
}
