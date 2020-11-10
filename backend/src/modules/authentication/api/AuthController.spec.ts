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
import querystring = require('querystring');

const PORT = getNewTestServerPort();
const server = express()
  .use(bodyParser.json())
  .use(sessionDataMiddleware({
    whitelistPaths: [
      '/auth/login',
      '/auth/changePassword',
      '/auth/resetPassword/userPartialEmailAddress',
      '/auth/resetPassword/sendVerificationCode',
      '/auth/resetPassword/verifyVerificationCode',
      '/auth/resetPassword'
    ],
  }))
  .post('/auth/login', AuthController.login)
  .delete('/auth/logout', AuthController.logout)
  .post('/auth/changePassword', AuthController.changePassword)
  .post('/auth/resetPassword/userPartialEmailAddress', AuthController.userPartialEmailAddress)
  .post('/auth/resetPassword/sendVerificationCode', AuthController.sendVerificationCode)
  .post('/auth/resetPassword/verifyVerificationCode', AuthController.verifyVerificationCode)
  .post('/auth/resetPassword', AuthController.resetPassword)
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

    describe('when credentials are unauthorized', () => {
      it('inform that password needs to be changed', done => {
        nock(TEST_APP_CONFIG.directoryServiceUrl)
          .post('/api/oauth2/v1/token')
          .reply(401, { error: 'unauthorized_client' });

        tester.post('/auth/login')
          .send({
            accountName: 'core-corey',
            userName: 'partner-technician',
            password: 'kennwort',
          })
          .expectStatus(401)
          .assertResponse((response) => {
            assert.deepEqual(response, { error: 'ERROR_PP_NOT_ALLOWED' });
            done();
          });
      });
    });
  });

  describe('changePassword()', () => {
    const oldPassword = 'kennwort';
    const newPassword = 'hasło';
    const accountName = 'core-corey';
    const userName = 'admin';

    it('works', (done) => {

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
          assert.deepEqual(response, '');
          done();
        });
    });

    it('password disobey password policy ', (done) => {
      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .post(
          '/api/oauth2/v1/change_password',
          `old_password=${oldPassword}&username=${accountName}%2F${userName}&new_password=${newPassword}`,
        )
        .reply(400,
          JSON.stringify({
            error: 'MC-13',
            message: 'MC-13: Password is not valid',
            values: [],
            children: [{
              error: 'MC-06',
              message: 'MC-06: Password must be at least [20] character(s) long',
            },
            {
              error: 'MC-07',
              message: 'MC-07: Password must contain at least [10] digit(s)',
            }],
          }));

      tester.post('/auth/changePassword')
        .send({
          accountName,
          userName,
          oldPassword,
          newPassword,
        })
        .expectStatus(400)
        .assertResponse((response) => {
          assert.deepEqual(response, {
            code: 400,
            message: 'PASSWORD_NOT_VALID',
            values: ['06: Password must be at least [20] character(s) long', '07: Password must contain at least [10] digit(s)'],
          });
          done();
        });
    });

    it('server error ', (done) => {
      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .post(
          '/api/oauth2/v1/change_password',
          `old_password=${oldPassword}&username=${accountName}%2F${userName}&new_password=${newPassword}`,
        )
        .reply(500, JSON.stringify({ error: 'CM-xx' }));

      tester.post('/auth/changePassword')
        .send({
          accountName,
          userName,
          oldPassword,
          newPassword,
        })
        .expectStatus(500)
        .assertResponse((response) => {
          assert.deepEqual(response, {
            code: 500,
            message: 'PASSWORD_CHANGE_FAILED'
          });
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
          assert.deepEqual(response, '');
          done();
        });
    });
  });

  describe('userPartialEmailAddress()', () => {
    const accountName = 'core-corey';
    const userName = 'admin';

    it('userPartialEmailAddress works', (done) => {

      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .post(
          '/api/oauth2/v1/userPartialEmailAddress',
          `accountName=${accountName}&userName=${userName}`
        )
        .reply(200, '***maskedEmail');

      tester.post('/auth/resetPassword/userPartialEmailAddress')
        .send({
          accountName,
          userName
        })
        .expectStatus(200)
        .assertResponse((response) => {
          assert.deepEqual(response, { maskedEmail: '***maskedEmail' });
          done();
        });
    });

    it('userPartialEmailAddress server error ', (done) => {
      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .post(
          '/api/oauth2/v1/userPartialEmailAddress',
          `accountName=${accountName}&userName=${userName}`
        )
        .reply(500, JSON.stringify({ error: 'CM-xx' }));

      tester.post('/auth/resetPassword/userPartialEmailAddress')
        .send({
          accountName,
          userName,
        })
        .expectStatus(500)
        .assertResponse((response) => {
          assert.deepEqual(response, {
            code: 500,
            message: ''
          });
          done();
        });
    });
  });

  describe('sendVerificationCode()', () => {
    const reqData = {
      accountName: 'core-corey',
      userName: 'admin',
      user_email_address: 'test@sap.com'
    };

    it('works', (done) => {
      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .post(
          '/api/oauth2/v1/send_verification_code',
          querystring.stringify(reqData)
        )
        .reply(200, '{}');

      tester.post('/auth/resetPassword/sendVerificationCode')
        .send(reqData)
        .expectStatus(200)
        .assertResponse((response) => {
          assert.deepEqual(response, '');
          done();
        });
    });

    it('server error ', (done) => {
      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .post(
          '/api/oauth2/v1/send_verification_code',
          querystring.stringify(reqData)
        )
        .reply(500, JSON.stringify({ error: 'CM-xx' }));

      tester.post('/auth/resetPassword/sendVerificationCode')
        .send(reqData)
        .expectStatus(500)
        .assertResponse((response) => {
          assert.deepEqual(response, {
            code: 500,
            message: ''
          });
          done();
        });
    });

    it('server error ', (done) => {
      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .post(
          '/api/oauth2/v1/send_verification_code',
          querystring.stringify(reqData)
        )
        .reply(400, JSON.stringify({ error: 'CM-xx' }));

      tester.post('/auth/resetPassword/sendVerificationCode')
        .send(reqData)
        .expectStatus(400)
        .assertResponse((response) => {
          assert.deepEqual(response, {
            code: 400,
            message: 'Cannot process the request due to multiple users with the same email were found.'
          });
          done();
        });
    });
  });

  describe('verifyVerificationCode()', () => {
    const reqData = {
      user_email_address: 'test@sap.com',
      accountName: 'core-corey',
      userName: 'admin',
      verification_code: 'verifictionCode'
    };

    it('works', (done) => {
      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .post(
          '/api/oauth2/v1/verify_verification_code',
          querystring.stringify(reqData)
        )
        .reply(200, '{}');

      tester.post('/auth/resetPassword/verifyVerificationCode')
        .send(reqData)
        .expectStatus(200)
        .assertResponse((response) => {
          assert.deepEqual(response, '');
          done();
        });
    });

    it('server error ', (done) => {
      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .post(
          '/api/oauth2/v1/verify_verification_code',
          querystring.stringify(reqData)
        ).reply(500, JSON.stringify({ error: 'CM-xx' }));

      tester.post('/auth/resetPassword/verifyVerificationCode')
        .send(reqData)
        .expectStatus(500)
        .assertResponse((response) => {
          assert.deepEqual(response, {
            code: 500,
            message: ''
          });
          done();
        });
    });

    it('server error ', (done) => {
      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .post(
          '/api/oauth2/v1/verify_verification_code',
          querystring.stringify(reqData)
        ).reply(400, JSON.stringify({ error: 'CM-xx' }));

      tester.post('/auth/resetPassword/verifyVerificationCode')
        .send(reqData)
        .expectStatus(400)
        .assertResponse((response) => {
          assert.deepEqual(response, {
            code: 400,
            message: 'Cannot process the request due to multiple users with the same email were found.'
          });
          done();
        });
    });

    it('server error ', (done) => {
      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .post(
          '/api/oauth2/v1/verify_verification_code',
          querystring.stringify(reqData)
        ).reply(404, JSON.stringify({ error: 'CM-xx' }));

      tester.post('/auth/resetPassword/verifyVerificationCode')
        .send(reqData)
        .expectStatus(404)
        .assertResponse((response) => {
          assert.deepEqual(response, {
            code: 404,
            message: 'Wrong verification code.'
          });
          done();
        });
    });
  });

  describe('resetPassword()', () => {
    const reqData = {
      user_email_address: 'test@sap.com',
      accountName: 'core-corey',
      userName: 'admin',
      verification_code: 'verifictionCode',
      password: 'Welcome1!'
    };

    it('works', (done) => {
      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .post(
          '/api/oauth2/v1/reset_password',
          querystring.stringify(reqData)
        )
        .reply(200, '{}');

      tester.post('/auth/resetPassword')
        .send(reqData)
        .expectStatus(200)
        .assertResponse((response) => {
          assert.deepEqual(response, '');
          done();
        });
    });

    it('server error ', (done) => {
      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .post(
          '/api/oauth2/v1/reset_password',
          querystring.stringify(reqData)
        )
        .reply(500, JSON.stringify({ error: 'CM-xx' }));

      tester.post('/auth/resetPassword')
        .send(reqData)
        .expectStatus(500)
        .assertResponse((response) => {
          assert.deepEqual(response, {
            code: 500,
            message: 'PASSWORD_CHANGE_FAILED'
          });
          done();
        });
    });

    it('password disobey password policy ', (done) => {
      nock(TEST_APP_CONFIG.directoryServiceUrl)
        .post(
          '/api/oauth2/v1/reset_password',
          querystring.stringify(reqData),
        )
        .reply(400,
          JSON.stringify({
            error: 'MC-13',
            message: 'MC-13: Password is not valid',
            values: [],
            children: [{
              error: 'MC-06',
              message: 'MC-06: Password must be at least [20] character(s) long',
            },
            {
              error: 'MC-07',
              message: 'MC-07: Password must contain at least [10] digit(s)',
            }],
          }));

      tester.post('/auth/resetPassword')
        .send(reqData)
        .expectStatus(400)
        .assertResponse((response) => {
          assert.deepEqual(response, {
            code: 400,
            message: 'PASSWORD_NOT_VALID',
            values: ['06: Password must be at least [20] character(s) long', '07: Password must contain at least [10] digit(s)'],
          });
          done();
        });
    });
  });
});
