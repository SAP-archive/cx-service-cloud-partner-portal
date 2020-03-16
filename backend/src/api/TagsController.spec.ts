import express = require('express');
import bodyParser = require('body-parser');
import nock = require('nock');
import assert = require('assert');
import TestConfigurationService = require('../services/test/TestConfigurationService');
import { getNewTestServerPort } from '../utils/getNewTestServerPort';
import { Tester } from '../services/test/Tester';
import { clientConfigService } from '@modules/common';
import sessionDataMiddleware from './middleware/sessiondata';
import { CrowdServiceResponse } from '@modules/data-access/services/CrowdServiceApi';
import { TEST_APP_CONFIG } from '../testAppConfig';
import { Tag } from '@modules/data-access/models';
import { exampleTag } from '@modules/data-access/models/Tag';
import { TagsController } from './TagsController';

const PORT = getNewTestServerPort();
const server = express()
  .use(bodyParser.json())
  .use(sessionDataMiddleware())
  .get('/portal/data/tags', TagsController.readAll)
  .listen(PORT);

const tester = new Tester({
  url: 'http://127.0.0.1',
  port: PORT,
});

after(() => server.close());

beforeEach(() => {
  clientConfigService.setConfig(TEST_APP_CONFIG);
});

describe('TagsController', () => {
  describe('readAll()', () => {
    it('sends backend request', done => {
      const tag = exampleTag();
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd-partner/v1/tags${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [tag],
          } as Partial<CrowdServiceResponse<Tag>>)
      ];

      tester.get('/portal/data/tags')
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(response, [tag]);
          done();
        });
    });
  });
});
