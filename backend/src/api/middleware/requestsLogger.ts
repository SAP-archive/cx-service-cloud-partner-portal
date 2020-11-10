import * as express from 'express';
import { UserDataRequest } from './sessiondata';
import { ILogger } from '@modules/status/model/ILogger';

const obfuscateBodyFields = [
  'password', 'oldPassword', 'newPassword', 'verification_code', 'user_email_address',
];

export function requestsLogger(logger: ILogger = null) {
  return (request: express.Request & UserDataRequest, response: express.Response, next: Function) => {
    if (request.path.indexOf('/portal/status') < 0 && request.path.indexOf('/portal/metrics') < 0) {
      let logBody = null;

      if (request.body) {
        logBody = JSON.parse(JSON.stringify(request.body));

        obfuscateBodyFields.forEach(fieldName => {
          if (logBody[fieldName]) {
            logBody[fieldName] = '******';
          }
        });
      }

      logger.info(`[transactionLogger] HEADERS: ${JSON.stringify(request.headers)} BODY: ${JSON.stringify(logBody)}`);
    }
    next();
  };
}
