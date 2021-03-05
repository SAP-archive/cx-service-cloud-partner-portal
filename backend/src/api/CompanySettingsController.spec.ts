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
import { CompanySettingsController } from './CompanySettingsController';

const PORT = getNewTestServerPort();
const server = express()
  .use(bodyParser.json())
  .use(sessionDataMiddleware())
  .get('/portal/company-settings', CompanySettingsController.fetch)
  .listen(PORT);

const tester = new Tester({
  url: 'http://127.0.0.1',
  port: PORT,
});

after(() => server.close());

beforeEach(() => {
  clientConfigService.setConfig(TEST_APP_CONFIG);
});

describe('CompanySettingsController', () => {
  describe('fetch()', () => {
    it('fetches company settings for logged in user', done => {
      const exampleSettings = () => ({someSetting: 'some value'});
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/api/data/v4/CompanySettings/actions/download${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {data: [{settings: {settings: exampleSettings()}}]}),
      ];

      tester.get('/portal/company-settings')
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(response, exampleSettings());
          done();
        });
    });
  });
});
