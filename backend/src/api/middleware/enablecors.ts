import express = require('express');
import logger = require('../../services/LoggerService');

const AUTHORIZED_HEADERS = [
  'X-Requested-With',
  'Pragma',
  'Accept',
  'Content-Type',
  'Authorization',
  'X-Client-Id',
  'X-Client-Version',
  'X-Request-ID',
  'X-Forwarded-For',
  'X-Cloud-Host',
  'X-No-Token-Prolongation',
  'x-cloud-user-id',
  'x-cloud-user-name',
  'x-cloud-company-id',
  'x-cloud-company-name',
  'x-cloud-account-id',
  'x-cloud-account-name',
];

export function enablecors(req: express.Request, res: express.Response, next: Function): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', AUTHORIZED_HEADERS.join(','));
  logger.debug('enablecors:: CORS enabled');
  next();
}
