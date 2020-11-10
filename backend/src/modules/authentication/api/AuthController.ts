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
import { SignInMetricData, SignInsCounterService } from '../../../metrics/sign-ins/SignInsCounterService';
import { CloudError } from '../../../interfaces/CloudError';
import { ClientError } from '../../../interfaces/ClientError';

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

interface ResetPasswordRequest extends express.Request {
  body: {
    accountName: string;
    userName: string;
    user_email_address: string;
    password: string;
    verification_code: string;
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
    const { accountName, userName, password } = req.body;
    AuthService.login({ accountName: accountName, userName: userName, password })
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
          SignInsCounterService.countSuccessfulSignIn(AuthController.getSignInMetric(req));
          res.json({
            authData: SessionDataFactory.create(loginResponse),
            person,
            localeCode,
            maxAttachmentSize,
          });
        } else {
          SignInsCounterService.countUnauthorizedSignInTry(AuthController.getSignInMetric(req));
          res.status(401);
          res.json({ error: 'ERROR_PP_NOT_ALLOWED' });
        }
      })
      .catch((error) => {
        if (error.statusCode === 400 && JSON.parse(error.response.body).error === 'expired_credentials') {
          SignInsCounterService.countSuccessfulSignIn(AuthController.getSignInMetric(req));
          res.status(200);
          res.json({ passwordNeedsToBeChanged: true });
        } else if (error.statusCode === 401) {
          SignInsCounterService.countUnauthorizedSignInTry(AuthController.getSignInMetric(req));
          res.status(401);
          res.json({ error: 'ERROR_PP_NOT_ALLOWED' });
        } else {
          SignInsCounterService.countSignInTryResultingInOtherError(AuthController.getSignInMetric(req));
          res.status(500);
          res.json({ error: 'LOGIN_FAILED' });
        }
      });
  }

  @validateBody({
    schema: {
      type: 'object',
      properties: {
        accountName: {
          type: ['string', 'null']
        },
        userName: {
          type: ['string', 'null']
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
      res.end();
    }).catch(error => {
      const clientError = AuthController.parseError(error, 'PASSWORD_CHANGE_FAILED');
      res.status(clientError.code);
      res.json(clientError);
    });
  }

  public static logout(req: LoginRequest & UserDataRequest, res: express.Response, next: () => void): void {
    const token = req.userData.authToken.split(' ')[1];
    if (!token) {
      res.status(500);
      res.json({ error: 'ERROR_INVALID_TOKEN' });
      next();
      return;
    }

    AuthService.logout(token).then(() => {
      res.end();
    }).catch((error) => {
      res.status(error.statusCode);
      res.json({ error: 'ERROR_WHILE_LOGGING_OUT' });
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
        }
      },
      required: [
        'accountName',
        'userName'
      ],
    },
  })
  public static userPartialEmailAddress(req: ResetPasswordRequest, res: express.Response) {
    AuthService.userPartialEmailAddress(req.body).then((maskedEmail) => {
      res.send({ maskedEmail });
    }).catch((error) => {
      const clientError = {
        code: error.statusCode,
        message: ''
      };

      try {
        const errorObj = JSON.parse(error.error) as CloudError;
        clientError.message = errorObj.message || '';
      } catch (e) {
        clientError.message = error.error || 'Unexpected error happened.';
      }

      res.status(clientError.code);
      res.json(clientError);
    });
  }

  @validateBody({
    schema: {
      type: 'object',
      properties: {
        accountName: {
          type: ['string', 'null']
        },
        userName: {
          type: ['string', 'null'],
        },
        user_email_address: {
          type: 'string',
        },
      },
      required: [
        'accountName',
        'userName',
        'user_email_address',
      ],
    },
  })
  public static sendVerificationCode(req: ResetPasswordRequest, res: express.Response) {
    AuthService.sendVerificationCode(req.body).then(() => {
      res.end();
    }).catch((error) => {
      const clientError = {
        code: error.statusCode,
        message: ''
      };

      if (error.statusCode === 400) {
        clientError.message = 'Cannot process the request due to multiple users with the same email were found.';
      } else {
        try {
          const errorObj = JSON.parse(error.error) as CloudError;
          clientError.message = errorObj.message || '';
        } catch (e) {
          clientError.message = error.error || 'Unexpected error happened.';
        }
      }

      res.status(clientError.code);
      res.json(clientError);
    });
  }

  @validateBody({
    schema: {
      type: 'object',
      properties: {
        accountName: {
          type: ['string', 'null'],
        },
        userName: {
          type: ['string', 'null'],
        },
        user_email_address: {
          type: 'string',
        },
        verification_code: {
          type: 'string',
        },
      },
      required: [
        'accountName',
        'userName',
        'user_email_address',
        'verification_code'
      ],
    },
  })
  public static verifyVerificationCode(req: ResetPasswordRequest, res: express.Response) {
    AuthService.verifyVerificationCode(req.body).then(() => {
      res.end();
    }).catch((error) => {
      const clientError = {
        code: error.statusCode,
        message: ''
      };

      if (error.statusCode === 404) {
        clientError.message = 'Wrong verification code.';
      } else if (error.statusCode === 400) {
        clientError.message = 'Cannot process the request due to multiple users with the same email were found.';
      } else {
        try {
          const errorObj = JSON.parse(error.error) as CloudError;
          clientError.message = errorObj.message || '';
        } catch (e) {
          clientError.message = error.error || 'Unexpected error happened.';
        }

      }

      res.status(clientError.code);
      res.json(clientError);
    });
  }

  @validateBody({
    schema: {
      type: 'object',
      properties: {
        accountName: {
          type: ['string', 'null'],
        },
        userName: {
          type: ['string', 'null'],
        },
        password: {
          type: 'string',
        },
        user_email_address: {
          type: 'string',
        },
        verification_code: {
          type: 'string',
        }
      },
      required: [
        'accountName',
        'userName',
        'password',
        'user_email_address',
        'verification_code'
      ],
    },
  })
  public static resetPassword(req: ResetPasswordRequest, res: express.Response) {
    AuthService.resetPassword(req.body).then(() => {
      res.end();
    }).catch((error) => {
      const clientError = AuthController.parseError(error, 'PASSWORD_CHANGE_FAILED');
      res.status(clientError.code);
      res.json(clientError);
    });
  }

  private static parseError(error: { statusCode: number; error: string }, defaultErrorMessage?: string): ClientError {
    const clientError: ClientError = {
      code: error.statusCode,
      message: defaultErrorMessage || 'ERROR'
    };
    if (error.statusCode === 400) {
      try {
        const errorObj = JSON.parse(error.error) as CloudError;
        if (errorObj.error === 'MC-13') {
          clientError.message = 'PASSWORD_NOT_VALID';
          clientError.values = (errorObj.children || [])
            .filter(item => item && /^MC-\d{1,}:*/.test(item.message))
            .map(item => item.message.replace(/^MC-\s*/, ''));
        }
      } catch (e) {
        return clientError;
      }
    }
    return clientError;
  }

  private static resolveUserDataFromLoginResponse(loginResponse: OAuthLoginResponse): UserData {
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

  private static getSignInMetric(req: LoginRequest): SignInMetricData {
    return {
      crowdAccountName: req.header('X-Cloud-Account-Name'),
      cloudHost: req.header('X-Cloud-Host'),
    };
  }
}
