import express = require('express');
import bodyParser = require('body-parser');
import nock = require('nock');
import assert = require('assert');
import TestConfigurationService = require('../services/test/TestConfigurationService');
import { getNewTestServerPort } from '../utils/getNewTestServerPort';
import { Tester } from '../services/test/Tester';
import { clientConfigService } from '@modules/common';
import sessionDataMiddleware from './middleware/sessiondata';
import { TEST_APP_CONFIG } from '../testAppConfig';
import { BusinessPartnerController } from './BusinessPartnerController';

const PORT = getNewTestServerPort();
const server = express()
  .use(bodyParser.json())
  .use(sessionDataMiddleware())
  .get('/portal/partners/:partnerId/action/terminate', BusinessPartnerController.terminateCrowdPartner)
  .listen(PORT);

const tester = new Tester({
  url: 'http://127.0.0.1',
  port: PORT,
});

after(() => server.close());

beforeEach(() => {
  clientConfigService.setConfig(TEST_APP_CONFIG);
});

describe('BusinessPartnerController', () => {
  describe('terminate()', () => {
    it('should use terminate relationships', done => {
      const partnerId = '1';
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd-partner/v1/partners/${partnerId}/actions/terminate${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {results: []}),
      ];
      tester.get(`/portal/partners/${partnerId}/action/terminate`)
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.ok(true);
          done();
        });

    });
  });
});
