import moduleAlias = require('module-alias');
import dotenv = require('dotenv');
import process = require('process');
import path = require('path');
import config = require('./services/AppConfiguration');

import bodyParser = require('body-parser');
import enablecorsMiddleware = require('./api/middleware/enablecors');
import logger = require('./services/LoggerService');

import express = require('express');
import helmet = require('helmet');
import errorHandler = require('errorhandler');

moduleAlias.addAlias('@modules/config', `${__dirname}/modules/config`);
moduleAlias.addAlias('@modules/status', `${__dirname}/modules/status`);
moduleAlias.addAlias('@modules/common', `${__dirname}/modules/common`);
moduleAlias.addAlias('@modules/authentication', `${__dirname}/modules/authentication`);
moduleAlias.addAlias('@modules/data-access', `${__dirname}/modules/data-access`);

import userDataMiddleware from './api/middleware/sessiondata';
import { clientConfiguration } from './services/ClientConfiguration';
import { VaultService } from './services/VaultService';
import { TechnicianController } from './api/TechnicianController';
import { TagsController } from './api/TagsController';
import { AuthController } from '@modules/authentication';
import { clientConfigService } from '@modules/common';
import { CompanyProfileController } from './api/CompanyProfileController';
import { DocumentsController } from './api/DocumentsController';
import { getConfig } from '@modules/config';
import { statusMiddleware } from '@modules/status';
import { LocalisationController } from './api/LocalisationController';
import { SkillCertificatesController } from './api/SkillCertificatesController';
import { BrandingController } from './api/BrandingController';
import { MetricsController } from './metrics/MetricsController';
import { LocalMetricsService } from './metrics/LocalMetricsService';
import { CrowdOwnerContactController } from './api/CrowdOwnerContactController';
import { BusinessPartnerController } from './api/BusinessPartnerController';
import { AssignmentsController } from './api/AssignmentsController';
import { requestsLogger } from './api/middleware/requestsLogger';

VaultService.initializeEnvVars();

const URL_PATH = '/portal';

function usageAndExit() {
  console.error('Usage: ');
  console.error('node app.js <config-file-json>');
  process.exit(0);
}

if (process.argv.length !== 3 || !process.argv[2]) {
  usageAndExit();
}
try {
  const confPath = process.argv[2];
  config.loadFromFile(path.resolve(confPath));

  const clientPath = path.dirname(confPath) +
    path.sep +
    'client' +
    path.sep +
    path.basename(confPath, '.json') +
    '.env';

  dotenv.config({path: path.resolve(clientPath)});
} catch (err) {
  console.error(err);
  usageAndExit();
}
clientConfiguration.setConfiguration(process.env);

clientConfigService.setConfig({
  clientIdentifier: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  clientVersion: process.env.APP_VERSION,
  debug: false,
  backendClusterDomain: config.dataCloudHost,
  backendClusterPort: config.dataCloudHost,
  directoryServiceUrl: config.directoryService,
});

const app: express.Application = express();

app.use(helmet());
app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded());
app.use(userDataMiddleware(
  {
    whitelistPaths: [
      '/portal/status',
      '/portal/metrics',
      '/portal/auth/login',
      '/portal/auth/changePassword',
      '/portal/getConfig',
      '/portal/auth/resetPassword/userPartialEmailAddress',
      '/portal/auth/resetPassword/sendVerificationCode',
      '/portal/auth/resetPassword/verifyVerificationCode',
      '/portal/auth/resetPassword',
    ],
  },
  logger,
));
app.use(requestsLogger(logger));

const env = config.mode || 'development';
if (env === 'development') {
  app.use(errorHandler({dumpExceptions: true, showStack: true}));
  app.use(enablecorsMiddleware.enablecors);
} else if (env === 'production') {
  app.use(errorHandler());
}

const NODE_LISTEN_PORT: number = parseInt(process.env.PORT, 10) || config.listenPort || 8000;
// routes

app.use(URL_PATH, statusMiddleware(
  logger,
  `${__dirname}/.build_info.json`,
  `${__dirname}/deployed.json`,
));

app.get('/portal/metrics', MetricsController.getMetrics);
app.get('/portal/getConfig', getConfig);

app.post('/portal/search/technicians', TechnicianController.search);
app.get('/portal/data/technician', TechnicianController.readAll);
app.post('/portal/data/technician', TechnicianController.create);
app.get('/portal/data/technician/:technicianId', TechnicianController.read);
app.put('/portal/data/technician/:technicianId', TechnicianController.update);
app.delete('/portal/data/technician/:technicianId', TechnicianController.remove);
app.get('/portal/data/technician/:technicianId/skills', TechnicianController.readSkills);
app.get('/portal/data/technician/:technicianId/skills/:skillId/certificate/download', SkillCertificatesController.download);
app.get('/portal/branding/crowdOwnerLogo', BrandingController.getLogo);
app.get('/portal/branding/crowdOwnerName', BrandingController.getCrowdOwnerName);
app.get('/portal/branding/crowdOwnerContact', BrandingController.getCrowdOwnerContact);

app.get('/portal/data/tags', TagsController.readAll);

app.get('/portal/companyProfile/read', CompanyProfileController.read);
app.put('/portal/companyProfile/save', CompanyProfileController.save);
app.get('/portal/documents/:id/download', DocumentsController.download);

app.post('/portal/auth/login', AuthController.login);
app.delete('/portal/auth/logout', AuthController.logout);
app.post('/portal/auth/changePassword', AuthController.changePassword);

app.post('/portal/setLocalisation', LocalisationController.setLocalisation);

app.post('/portal/auth/resetPassword/userPartialEmailAddress', AuthController.userPartialEmailAddress);
app.post('/portal/auth/resetPassword/sendVerificationCode', AuthController.sendVerificationCode);
app.post('/portal/auth/resetPassword/verifyVerificationCode', AuthController.verifyVerificationCode);
app.post('/portal/auth/resetPassword', AuthController.resetPassword);
app.get('/portal/crowdOwnerContact', CrowdOwnerContactController.getContact);
app.get('/portal/partners/:partnerId/action/terminate', BusinessPartnerController.terminateCrowdPartner);

app.get('/portal/assignments', AssignmentsController.fetchAssignments);
app.get('/portal/assignments-stats', AssignmentsController.fetchAssignmentsStats);
app.post('/portal/assignments/:assignmentId/actions/reject', AssignmentsController.rejectAssignment);
app.post('/portal/assignments/:assignmentId/actions/accept', AssignmentsController.acceptAssignment);
app.post('/portal/assignments/:assignmentId/actions/update', AssignmentsController.updateAssignment);
app.post('/portal/assignments/:assignmentId/actions/close', AssignmentsController.closeAssignment);
app.post('/portal/assignments/:assignmentId/actions/release', AssignmentsController.releaseAssignment);

try {
  app.listen(NODE_LISTEN_PORT, function () {
    logger.info(`Server listening on port ${NODE_LISTEN_PORT} in ${env} mode`);
  });
} catch (error) {
  logger.error('Cannot launch server: ' + error.toString());
}

const start: Date = new Date();
(function logStatus() {
  logger.info(`PROC_STATS since: ` +
    `${start.getFullYear()}-${(start.getMonth() + 1)}-${start.getDate()} ` +
    `${start.getHours()}:${start.getMinutes()}:${start.getSeconds()} ` +
    `memory: ${JSON.stringify(process.memoryUsage())}`);
  setTimeout(logStatus, 60000);
})();

LocalMetricsService.bootstrapMetrics();
