import express = require('express');
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
    // todo: add better logging
    // tslint:disable-next-line
    console.error('An error occurred');

    if (handleResponse) {
      if (!clientError) {
        res.status(StatusCode.INTERNAL_ERROR);
        res.json({
          message: 'BACKEND_ERROR_UNEXPECTED',
        });
        return;
      }

      res.status(clientError.code);
      res.json({
        message: clientError.message,
        details: clientError.details,
      });
    }
  }


  public static isPublicClientRequest(req: express.Request): boolean {
    return req.headers[ApiHelper.HEADER_CLIENT_IDENTIFIER] !== clientConfigService.getConfig().clientIdentifier;
  }
}
