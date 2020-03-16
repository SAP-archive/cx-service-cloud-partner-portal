import express = require('express');
import bodyParser = require('body-parser');
import nock = require('nock');
import assert = require('assert');
import TestConfigurationService = require('../services/test/TestConfigurationService');
import { getNewTestServerPort } from '../utils/getNewTestServerPort';
import { Tester } from '../services/test/Tester';
import { clientConfigService } from '@modules/common';
import sessionDataMiddleware from './middleware/sessiondata';
import { SkillCertificatesController } from './SkillCertificatesController';
import { TEST_APP_CONFIG } from '../testAppConfig';

const PORT = getNewTestServerPort();
const server = express()
  .use(bodyParser.json())
  .use(sessionDataMiddleware())
  .get('/portal/technician/:technicianId/skills/:skillId/certificate/download', SkillCertificatesController.download)
  .listen(PORT);

const tester = new Tester({
  url: 'http://127.0.0.1',
  port: PORT,
});

after(() => server.close());

beforeEach(() => {
  clientConfigService.setConfig(TEST_APP_CONFIG);
});

describe('SkillCertificatesController', () => {
  describe('download()', () => {
    it('should stream an attachment', (done) => {
      const technicianId = '123';
      const skillId = '321';
      const expectedResponse = () => ({some: 'data'});
      const downloadNock = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
        .get(`/cloud-crowd-service/api/crowd/v2/technicians/${technicianId}/skills/${skillId}/certificates/attachments`)
        .reply(200, expectedResponse());

      tester.get(`/portal/technician/${technicianId}/skills/${skillId}/certificate/download`)
        .with('headers', TestConfigurationService.HEADERS)
        .expectStatus(200)
        .assertResponse(response => {
          downloadNock.isDone();
          assert.deepEqual(response, expectedResponse());
          done();
        });
    });

    it('should return an 404 if document does not exist', done => {
      const technicianId = '123';
      const skillId = '321';
      const downloadNock = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
        .get(`/cloud-crowd-service/api/crowd/v2/technicians/${technicianId}/skills/${skillId}/certificates/attachments`)
        .reply(404);

      tester.get(`/portal/technician/${technicianId}/skills/${skillId}/certificate/download`)
        .with('headers', TestConfigurationService.HEADERS)
        .expectStatus(404)
        .assertResponse(() => {
          downloadNock.isDone();
          done();
        });
    });
  });

});
