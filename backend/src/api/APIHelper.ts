import express = require('express');
import logger = require('../services/LoggerService');
import { clientConfigService } from '@modules/common';
import { ClientError } from 'interfaces/ClientError';

export enum StatusCode {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
  FORBIDDEN = 403,
}

export class ApiHelper {
  private static readonly HEADER_CLIENT_IDENTIFIER = 'X-Client-Id';

  public static async processError(res: express.Response, clientError?: ClientError, handleResponse: boolean = true): Promise<void> {
    if (!handleResponse || !clientError) {
      logger.error(`Unexpected Internal Error`);
    }

    if (handleResponse) {
      try {
        if (!clientError) {
          res.status(StatusCode.INTERNAL_ERROR);
          res.json({
            message: 'BACKEND_ERROR_UNEXPECTED',
          });
          return;
        }

        const code = clientError.code ? clientError.code : clientError.statusCode;
        const codePart = code ? ` (Code ${code})` : '';
        const messagePart = clientError.details ? `${clientError.message}. Details: ${clientError.details}` : clientError.message;
        logger.error(`Unexpected Error${codePart}. ${messagePart}`);
        res.status(code);
        res.json({
          message: clientError.message,
          details: clientError.details,
        });
      } catch (error) {
        logger.error('Unexpected error when dealing with error response');
      }
    }
  }


  public static isPublicClientRequest(req: express.Request): boolean {
    return req.headers[ApiHelper.HEADER_CLIENT_IDENTIFIER] !== clientConfigService.getConfig().clientIdentifier;
  }
}
