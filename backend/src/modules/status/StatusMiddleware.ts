import express = require('express');
import { ILogger } from './model/ILogger';
import { StatusController } from './api/status/StatusController';
import { FileReader } from './service/FileReader';
import { IBuildInfo } from './model/IBuildInfo';
import { IDeployInfo } from './model/IDeployInfo';

export function statusMiddleware(
  logger: Readonly<ILogger>,
  buildInfoFilePath: string,
  deployInfoFilePath: string,
): express.Router {
  const router = express.Router();

  const reader = new FileReader(logger);
  const getBuildInfo = () => reader.tryReadJsonFile<IBuildInfo>(buildInfoFilePath);
  const getDeployInfo = () => reader.tryReadJsonFile<IDeployInfo>(deployInfoFilePath, false);

  const statusCtrl = new StatusController(logger, getBuildInfo, getDeployInfo);

  router.get('/status', statusCtrl.handler);

  return router;
}

