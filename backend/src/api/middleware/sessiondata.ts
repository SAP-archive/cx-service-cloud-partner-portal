import * as express from 'express';
import * as minimatch from 'minimatch';
import { UserData } from '@modules/common/types';

type Options = {
  whitelistPaths?: string[];
};

export type UserDataRequest = {
  userData: UserData,
};

export default function setup(options: Options = {}) {
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

    next();
  };
}
