import * as express from 'express';
import * as minimatch from 'minimatch';
import { UserData } from '@modules/common/types';
import { v4 as uuid } from 'uuid';
import { requestContextService } from '../../services/RequestContextService';
import Credentials = require('../../models/Credentials');
import { ILogger } from '@modules/status/model/ILogger';

type Options = {
  whitelistPaths?: string[];
};

export type UserDataRequest = {
  userData: UserData,
};

function getHeader(logger: ILogger, request: express.Request, headerName: string, defaultValue: string = ''): string {
  if (!request.header(headerName)) {
    return defaultValue;
  }
  return request.header(headerName);
}

export default function setup(options: Options = {}, logger: ILogger = null) {
  return (request: express.Request & UserDataRequest, response: express.Response, next: Function) => {
    if (options.whitelistPaths
      && options.whitelistPaths.some(pattern => minimatch(request.path, pattern))) {
      next();
      return;
    }

    const {headers} = request;
    const account = headers['x-cloud-account-name'],
      accountId = headers['x-cloud-account-id'],
      user = headers['x-cloud-user-name'],
      userId = headers['x-cloud-user-id'],
      company = headers['x-cloud-company-name'],
      companyId = headers['x-cloud-company-id'],
      authorization = headers.authorization;
    const traceId = response.getHeader ? <string>response.getHeader('x-b3-traceid') : '';
    const spanId = response.getHeader ? <string>response.getHeader('x-b3-spanid') : '';
    const sampledValue = response.getHeader ? <number>response.getHeader('x-b3-sampled') : 0;
    const requestId = getHeader(logger, request, 'X-Request-ID', uuid());
    const clientId = getHeader(logger, request, 'X-Client-Id');
    const clientVersion = getHeader(logger, request, 'X-Client-Version', '1');
    const forwardedFor = getHeader(logger, request, 'X-Forwarded-For', '');
    const cloudHost = getHeader(logger, request, 'X-Cloud-Host', '');
    const noTokenProlongation = getHeader(logger, request, 'X-No-Token-Prolongation', '');

    if (!(account && accountId && user && userId && authorization && company && companyId)) {
      response.status(401);
      response.send({error: 'No user data specified.'});
      return;
    }

    request.userData = {
      accountName: account as string,
      accountId: accountId as string,
      userName: user as string,
      userId: userId as string,
      authToken: authorization,
      companyName: company as string,
      companyId: companyId as string,
    };

    requestContextService.save(
      new Credentials(
        account as string,
        company as string,
        user as string,
        authorization,
        accountId as string,
        companyId as string,
        userId as string,
      ),
      {
        requestPath: request.path,
        requestMethod: request.method,
        traceId,
        spanId,
        sampledValue,
      },
      {
        requestId,
        clientId,
        clientVersion,
        forwardedFor,
        cloudHost,
        noTokenProlongation
      },
      () => {
        next();
      },
    );
  };
}
