import * as express from 'express';
import { ILogger } from '../../model/ILogger';
import { IBuildInfo } from '../../model/IBuildInfo';
import { IDeployInfo } from '../../model/IDeployInfo';

export class StatusController {
  private readonly statusInfo: {
    status: string;
    version: any;
    lastCommit: any;
    buildTimestamp: any;
    deployTimestamp: any;
    startTimestamp: string;
    serviceName: string;
  };

  constructor(private logger: Readonly<ILogger>, readonly getBuildInfo: () => Readonly<IBuildInfo | null>, getDeployInfo: () => Readonly<IDeployInfo | null>) {
    const buildInfoJson = getBuildInfo();
    const deployInfoJson = getDeployInfo();

    this.statusInfo = {
      status: buildInfoJson ? 'ok' : 'buildInfoMissing',
      version: buildInfoJson ? buildInfoJson.version : 'UNKNOWN',
      lastCommit: buildInfoJson ? buildInfoJson.lastCommit : 'UNKNOWN',
      buildTimestamp: buildInfoJson ? buildInfoJson.buildTimestamp : 'UNKNOWN',
      deployTimestamp: deployInfoJson ? deployInfoJson.timestamp : 'UNKNOWN',
      startTimestamp: new Date().toISOString(),
      serviceName: buildInfoJson ? buildInfoJson.serviceName : 'UNKNOWN',
    };
  }

  public handler = (req: express.Request, res: express.Response, next: Function) => {
    res.status(200)
      .json(this.statusInfo);

    res.end();
  };
}

