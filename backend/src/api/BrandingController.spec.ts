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
import { BrandingController } from './BrandingController';
import { CrowdOwnerContactInfo } from 'services/BrandingService';
import { BrandingSetting, exampleBrandingSetting } from '@modules/data-access/models/BrandingSetting';
import { assertAllDone } from 'utils/tests/nock-utils';
import { BrandingSettingKey } from '@modules/data-access/types/BrandingSettingKey';

const PORT = getNewTestServerPort();
const server = express()
  .use(bodyParser.json())
  .use(sessionDataMiddleware())
  .get('/portal/branding/crowdOwnerContact', BrandingController.getCrowdOwnerContact)
  .get('/portal/branding/crowdOwnerLogo', BrandingController.getLogo)
  .get('/portal/branding/crowdOwnerName', BrandingController.getCrowdOwnerName)
  .listen(PORT);

const tester = new Tester({
  url: 'http://127.0.0.1',
  port: PORT,
});

after(() => server.close());

before(() => {
  clientConfigService.setConfig(TEST_APP_CONFIG);
});

describe('BrandingController', () => {
  describe('getCrowdOwnerContact()', () => {
    it('parses backend response and returns contact details', done => {
      const exampleEmailAddress = 'test@test.de';
      const exampleName = 'John Doe';
      const examplePhoneNumber = '+491768372748';
      const exampleSettings: BrandingSetting[] = [
        {
          key: 'CrowdOwner.Contact.EMail',
          type: 'EMAIL',
          value: exampleEmailAddress,
        },
        {
          key: 'CrowdOwner.Contact.PhoneNumber',
          type: 'PHONE',
          value: examplePhoneNumber,
        },
        {
          key: 'CrowdOwner.Contact.Name',
          type: 'STRING',
          value: exampleName,
        },
      ];

      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-branding-service/api/branding/v1/settings/CrowdOwner.Contact.EMail${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, exampleSettings[0]),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-branding-service/api/branding/v1/settings/CrowdOwner.Contact.PhoneNumber${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, exampleSettings[1]),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-branding-service/api/branding/v1/settings/CrowdOwner.Contact.Name${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, exampleSettings[2]),
      ];

      tester.get('/portal/branding/crowdOwnerContact')
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          assertAllDone(nockScopes);
          assert.deepEqual(response, {
            name: exampleName,
            emailAddress: exampleEmailAddress,
            phoneNumber: examplePhoneNumber,
          } as CrowdOwnerContactInfo);
          done();
        });
    });
  });

  describe('getLogo()', () => {
    it('fetches setting and returns value only', done => {
      const exampleSetting = exampleBrandingSetting('CrowdOwner.Logo');

      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-branding-service/api/branding/v1/settings/${'CrowdOwner.Logo' as BrandingSettingKey}${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, exampleSetting),
      ];

      tester.get(`/portal/branding/crowdOwnerLogo`)
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          assertAllDone(nockScopes);
          assert.deepEqual(response, {logoString: exampleSetting.value});
          done();
        });
    });

    it('returns 200 with default value when setting not found', done => {
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-branding-service/api/branding/v1/settings/${'CrowdOwner.Logo' as BrandingSettingKey}${TestConfigurationService.requestQuerySuffix()}`)
          .reply(404),
      ];

      tester.get(`/portal/branding/crowdOwnerLogo`)
        .expectStatus(200)
        .assertResponse((response) => {
          assertAllDone(nockScopes);
          assert.deepEqual(response, {});
          done();
        });
    });
  });

  describe('getCrowdName()', () => {
    it('fetches setting and returns value only', done => {
      const exampleSetting = exampleBrandingSetting('CrowdOwner.About.Title');

      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-branding-service/api/branding/v1/settings/${'CrowdOwner.About.Title' as BrandingSettingKey}${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, exampleSetting),
      ];

      tester.get(`/portal/branding/crowdOwnerName`)
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          assertAllDone(nockScopes);
          assert.deepEqual(response, {crowdName: exampleSetting.value});
          done();
        });
    });

    it('returns 200 with default value when setting not found', done => {
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-branding-service/api/branding/v1/settings/${'CrowdOwner.About.Title' as BrandingSettingKey}${TestConfigurationService.requestQuerySuffix()}`)
          .reply(404),
      ];

      tester.get(`/portal/branding/crowdOwnerName`)
        .expectStatus(200)
        .assertResponse((response) => {
          assertAllDone(nockScopes);
          assert.deepEqual(response, {});
          done();
        });
    });
  });

});
