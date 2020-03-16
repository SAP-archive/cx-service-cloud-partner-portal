import express = require('express');
import bodyParser = require('body-parser');
import nock = require('nock');
import assert = require('assert');
import TestConfigurationService = require('../services/test/TestConfigurationService');
import { getNewTestServerPort } from '../utils/getNewTestServerPort';
import { Tester } from '../services/test/Tester';
import { clientConfigService } from '@modules/common';
import sessionDataMiddleware from './middleware/sessiondata';
import { CompanyProfileController } from './CompanyProfileController';
import { exampleAddress } from '../models/Address';
import { exampleContact } from '../models/Contact';
import { exampleCompanyDetailsDto } from '@modules/data-access/dtos/CompanyDetailsDto';
import { DtoVersionProvider } from '@modules/data-access';
import { exampleBusinessPartnerDto } from '@modules/data-access/dtos/BusinessPartnerDto';
import { exampleDocument } from '../models/Document';
import { exampleSaveCompanyProfileData } from '../models/SaveCompanyProfileData';
import { CompanyProfile, exampleCompanyProfile } from '../models/CompanyProfile';
import { TEST_APP_CONFIG } from '../testAppConfig';
import { exampleServiceArea } from '../models/ServiceArea';

const PORT = getNewTestServerPort();
const server = express()
  .use(bodyParser.json())
  .use(sessionDataMiddleware())
  .get('/portal/companyProfile/read', CompanyProfileController.read)
  .put('/portal/companyProfile/save', CompanyProfileController.save)
  .listen(PORT);

const tester = new Tester({
  url: 'http://127.0.0.1',
  port: PORT,
});

after(() => server.close());

beforeEach(() => {
  clientConfigService.setConfig(TEST_APP_CONFIG);
});

describe('CompanyProfileController', () => {
  describe('read()', () => {
    it('works', done => {
      const partnerId = '456';
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/api/query/v1?dtos=${DtoVersionProvider.getVersionsParameter(['UnifiedPerson'])}${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, {
            data: [{
              person: {
                id: '123',
                businessPartner: partnerId,
              },
            }],
          }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/api/data/v4/BusinessPartner/${partnerId}?dtos=${DtoVersionProvider.getVersionsParameter(['BusinessPartner'])}${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, {
            data: [{businessPartner: exampleBusinessPartnerDto(partnerId)}],
          }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd-partner/v1/partners/${partnerId}/addresses${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [exampleAddress()],
          }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd-partner/v1/partners/${partnerId}/contacts${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [exampleContact()],
          }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd-partner/v1/partners/${partnerId}/service-areas${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [exampleServiceArea()],
          }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd/v1/documents${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [exampleDocument()],
          }),
      ];

      tester.get('/portal/companyProfile/read')
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(response,
            {
              companyDetails: {
                ...exampleBusinessPartnerDto(partnerId),
                address: exampleAddress(),
                contact: exampleContact(),
                serviceArea: exampleServiceArea(),
              },
              documents: [exampleDocument()],
            } as CompanyProfile);
          done();
        });
    });

    it('forbidden to read as a technician', done => {
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/api/query/v1?dtos=${DtoVersionProvider.getVersionsParameter(['UnifiedPerson'])}${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, {
            data: [],
          })
      ];

      tester.get('/portal/companyProfile/read')
        .expectStatus(403)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(response,
            {
              message: 'FORBIDDEN',
            });
          done();
        });
    });
  });

  describe('save()', () => {
    it('works', done => {
      const partnerId = '456';
      const removedDocumentId = exampleSaveCompanyProfileData().removedDocumentsIds[0];
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/api/query/v1?dtos=${DtoVersionProvider.getVersionsParameter(['UnifiedPerson'])}${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, {
            data: [
              {
                person: {
                  id: '123',
                  businessPartner: partnerId,
                },
              },
            ],
          }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .put(`/cloud-crowd-service/api/crowd-partner/v1/partners/${partnerId}${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [exampleCompanyDetailsDto()],
          }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .delete(`/cloud-crowd-service/api/crowd/v1/documents/${removedDocumentId}${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, undefined),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/cloud-crowd-service/api/crowd/v1/documents${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, undefined),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd/v1/documents${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [exampleDocument()],
          }),
      ];

      tester.put('/portal/companyProfile/save')
        .send(exampleSaveCompanyProfileData())
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(response, exampleCompanyProfile());
          done();
        });
    });
  });
});
