import express = require('express');
import bodyParser = require('body-parser');
import nock = require('nock');
import assert = require('assert');
import TestConfigurationService = require('../../../services/test/TestConfigurationService');
import { AuthController } from './AuthController';
import { getNewTestServerPort } from '../../../utils/getNewTestServerPort';
import { Tester } from '../../../services/test/Tester';
import { clientConfigService } from '@modules/common';
import sessionDataMiddleware from '../../../api/middleware/sessiondata';
import { DtoVersionProvider } from '@modules/data-access';
import { TEST_APP_CONFIG } from '../../../testAppConfig';

const PORT = getNewTestServerPort();
const server = express()
  .use(bodyParser.json())
  .use(sessionDataMiddleware({
    whitelistPaths: [
      '/auth/login',
      '/auth/changePassword',
    ],
  }))
  .post('/auth/login', AuthController.login)
  .delete('/auth/logout', AuthController.logout)
  .post('/auth/changePassword', AuthController.changePassword)
  .listen(PORT);

const tester = new Tester({
  url: 'http://127.0.0.1',
  port: PORT,
});

after(() => server.close());

beforeEach(() => {
  clientConfigService.setConfig(TEST_APP_CONFIG);
});

describe('AuthController', () => {
  describe('login()', () => {
    it('works when the logged in user is linked with a Business Partner', done => {
      const maxAttachmentSize = 5;
      const nockScopes = [
        nock(TEST_APP_CONFIG.directoryServiceUrl)
          .post('/api/oauth2/v1/token')
          .reply(200, {
            access_token: 'accessToken',
            token_type: 'tokenType',
            companies: [{
              id: TestConfigurationService.HEADERS['x-cloud-company-id'],
              name: TestConfigurationService.HEADERS['x-cloud-company-name'],
            }],
            account: TestConfigurationService.HEADERS['x-cloud-account-name'],
            account_id: TestConfigurationService.HEADERS['x-cloud-account-id'],
            user: TestConfigurationService.HEADERS['x-cloud-user-name'],
            user_id: TestConfigurationService.HEADERS['x-cloud-user-id'],
            cluster_url: 'url',
          }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/api/master/v1/userSettings/Cockpit_SelectedLocale${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, { data: 'en-gb' }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/api/data/v4/ProfileObject/actions/download${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, { data: [{ profileObject: { maxAttachmentSize } }] }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/api/query/v1?dtos=${DtoVersionProvider.getVersionsParameter(['UnifiedPerson'])}${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, {
            data: [
              {
                person: {
                  id: '12345',
                  firstName: 'John',
                  lastName: 'Doe',
                },
              },
            ],
          }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/api/query/v1?dtos=${DtoVersionProvider.getVersionsParameter(['UnifiedPerson'])}${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, {
            data: [
              {
                person: {
                  id: '796F73A',
                  businessPartner: 'A442864'
                }
              }
            ]
          }),
      ];

      tester.post('/auth/login')
        .send({
          accountName: 'core-corey',
          userName: 'partner-admin',
          password: 'kennwort',
        })
        .expectStatus(200)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(response, {
            authData: {
              accountName: TestConfigurationService.HEADERS['x-cloud-account-name'],
              accountId: TestConfigurationService.HEADERS['x-cloud-account-id'],
              userName: TestConfigurationService.HEADERS['x-cloud-user-name'],
              userId: TestConfigurationService.HEADERS['x-cloud-user-id'],
              companyName: TestConfigurationService.HEADERS['x-cloud-company-name'],
              companyId: TestConfigurationService.HEADERS['x-cloud-company-id'],
              authToken: 'tokenType accessToken',
              clusterUrl: 'url',
            },
            person: {
              id: '12345',
              firstName: 'John',
              lastName: 'Doe',
            },
            localeCode: 'en-gb',
            maxAttachmentSize,
          });
          done();
        });
    });

    it('returns 401 error when the logged in user is not linked with a Business Partner', done => {
      const maxAttachmentSize = 5;
      const nockScopes = [
        nock(TEST_APP_CONFIG.directoryServiceUrl)
          .post('/api/oauth2/v1/token')
          .reply(200, {
            access_token: 'accessToken',
            token_type: 'tokenType',
            companies: [{
              id: TestConfigurationService.HEADERS['x-cloud-company-id'],
              name: TestConfigurationService.HEADERS['x-cloud-company-name'],
            }],
            account: TestConfigurationService.HEADERS['x-cloud-account-name'],
            account_id: TestConfigurationService.HEADERS['x-cloud-account-id'],
            user: TestConfigurationService.HEADERS['x-cloud-user-name'],
            user_id: TestConfigurationService.HEADERS['x-cloud-user-id'],
            cluster_url: 'url',
          }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/api/master/v1/userSettings/Cockpit_SelectedLocale${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, { data: 'en-gb' }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/api/data/v4/ProfileObject/actions/download${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, { data: [{ profileObject: { maxAttachmentSize } }] }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/api/query/v1?dtos=${DtoVersionProvider.getVersionsParameter(['UnifiedPerson'])}${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, {
            data: [
              {
                person: {
                  id: '12345',
                  firstName: 'John',
                  lastName: 'Doe',
                },
              },
            ],
          }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/api/query/v1?dtos=${DtoVersionProvider.getVersionsParameter(['UnifiedPerson'])}${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, { data: [] }),
      ];

      tester.post('/auth/login')
        .send({
          accountName: 'core-corey',
          userName: 'crowd-owner-or-partner-technician',
          password: 'kennwort',
        })
        .expectStatus(401)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(response, { error: 'ERROR_PP_NOT_ALLOWED' });
          done();
        });
    });

    describe('when credentials are expired', () => {
      it('inform that password needs to be changed', done => {
        nock(TEST_APP_CONFIG.directoryServiceUrl)
          .post('/api/oauth2/v1/token')
          .reply(400, { error: 'expired_credentials' });

        tester.post('/auth/login')
          .send({
            accountName: 'core-corey',
            userName: 'admin',
            password: 'kennwort',
          })
          .expectStatus(200)
          .assertResponse((response) => {
            assert.deepEqual(response, { passwordNeedsToBeChanged: true });
            done();
          });
      });
    });
  });

  describe('changePassword()', () => {
    it('works', (done) => {
      const oldPassword = 'kennwort';
      const newPassword = 'hasło';
      const accountName = 'core-corey';
      const userName = 'admin';

      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .post(
          '/api/oauth2/v1/change_password',
          `old_password=${oldPassword}&username=${accountName}%2F${userName}&new_password=${newPassword}`,
        )
        .reply(200, '{}');

      tester.post('/auth/changePassword')
        .send({
          accountName,
          userName,
          oldPassword,
          newPassword,
        })
        .expectStatus(200)
        .assertResponse((response) => {
          assert.deepEqual(response, undefined);
          done();
        });
    });
  });

  describe('logout()', () => {
    it('works', done => {
      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .delete(`/api/oauth2/v1/token/myToken`)
        .reply(200);

      tester.delete('/auth/logout')
        .with('headers', TestConfigurationService.HEADERS)
        .expectStatus(200)
        .assertResponse((response) => {
          assert.deepEqual(response, undefined);
          done();
        });
    });
  });
});
