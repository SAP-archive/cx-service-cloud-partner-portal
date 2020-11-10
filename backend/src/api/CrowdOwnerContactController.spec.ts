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
import { CrowdOwnerContactController } from './CrowdOwnerContactController';
import { examplePartnerContact, PartnerContact } from '@modules/data-access/models/PartnerContact';
import { emptyCrowdOwnerContactInfo } from 'services/BrandingService';

const PORT = getNewTestServerPort();
const server = express()
  .use(bodyParser.json())
  .use(sessionDataMiddleware())
  .get('/portal/crowdOwnerContact', CrowdOwnerContactController.getContact)
  .listen(PORT);

const tester = new Tester({
  url: 'http://127.0.0.1',
  port: PORT,
});

after(() => server.close());

beforeEach(() => {
  clientConfigService.setConfig(TEST_APP_CONFIG);
});

describe('CrowdOwnerContactController', () => {
  describe('getContact()', () => {
    it('should get contact from partner contacts api', done => {
      const getNock =
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd-partner/v1/partner-contacts${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [examplePartnerContact()],
          } as Partial<CrowdServiceResponse<PartnerContact>>);

      const contact = examplePartnerContact();
      const expectedContact = {
        name: contact.firstName + ' ' + contact.lastName,
        emailAddress: contact.emailAddress,
        phoneNumber: contact.officePhone
      };
      tester.get('/portal/crowdOwnerContact')
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          getNock.isDone();
          assert.deepEqual(response, expectedContact);
          done();
        });
    });

    it('should get empty contact from partner contacts api', done => {
      const getNock =
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd-partner/v1/partner-contacts${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [],
          } as Partial<CrowdServiceResponse<PartnerContact>>);

      tester.get('/portal/crowdOwnerContact')
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          getNock.isDone();
          assert.deepEqual(response, emptyCrowdOwnerContactInfo());
          done();
        });
    });
  });
});
