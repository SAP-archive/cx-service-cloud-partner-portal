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
import { LocalisationController } from './LocalisationController';

const PORT = getNewTestServerPort();
const server = express()
  .use(bodyParser.json())
  .use(sessionDataMiddleware())
  .post('/portal/setLocalisation', LocalisationController.setLocalisation)
  .listen(PORT);

const tester = new Tester({
  url: 'http://127.0.0.1',
  port: PORT,
});

after(() => server.close());

beforeEach(() => {
  clientConfigService.setConfig(TEST_APP_CONFIG);
});

describe('LocalisationController', () => {
  describe('setLocalisation()', () => {
    it('should set two CloudStorageItems values', (done) => {
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(
            `/api/master/v1/userSettings/Cockpit_SelectedLocale${TestConfigurationService.requestQuerySuffix()}`,
            {data: 'en-gb', version: 1},
          )
          .reply(200, undefined),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(
            `/api/master/v1/userSettings/Cockpit_SelectedLanguage${TestConfigurationService.requestQuerySuffix()}`,
            {data: 'en', version: 1},
          )
          .reply(200, undefined),
      ];

      tester.post(`/portal/setLocalisation`)
        .send({code: 'en-gb', language: 'en'})
        .with('headers', TestConfigurationService.HEADERS)
        .expectStatus(200)
        .assertResponse(response => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          done();
        });
    });
  });
});
