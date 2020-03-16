import express = require('express');
import bodyParser = require('body-parser');
import nock = require('nock');
import assert = require('assert');
import TestConfigurationService = require('../services/test/TestConfigurationService');
import { getNewTestServerPort } from '../utils/getNewTestServerPort';
import { Tester } from '../services/test/Tester';
import { clientConfigService, ClientConfiguration } from '@modules/common';
import sessionDataMiddleware from './middleware/sessiondata';
import { DocumentsController } from './DocumentsController';
import { TEST_APP_CONFIG } from '../testAppConfig';

const PORT = getNewTestServerPort();
const server = express()
  .use(bodyParser.json())
  .use(sessionDataMiddleware())
  .get('/portal/documents/:id/download', DocumentsController.download)
  .listen(PORT);

const tester = new Tester({
  url: 'http://127.0.0.1',
  port: PORT,
});

after(() => server.close());

beforeEach(() => {
  clientConfigService.setConfig(TEST_APP_CONFIG);
});

describe('DocumentsController', () => {
  describe('download()', () => {
    it('should stream an attachment', (done) => {
      const documentId = '1';
      const expectedResponse = () => ({some: 'data'});
      const downloadNock = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
        .get(`/cloud-crowd-service/api/crowd/v1/documents/${documentId}/attachments`)
        .reply(200, expectedResponse());

      tester.get(`/portal/documents/${documentId}/download`)
        .with('headers', TestConfigurationService.HEADERS)
        .expectStatus(200)
        .assertResponse(response => {
          downloadNock.isDone();
          assert.deepEqual(response, expectedResponse());
          done();
        });
    });
  });
});
