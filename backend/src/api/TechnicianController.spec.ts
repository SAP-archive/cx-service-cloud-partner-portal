import express = require('express');
import bodyParser = require('body-parser');
import nock = require('nock');
import assert = require('assert');
import TestConfigurationService = require('../services/test/TestConfigurationService');
import { getNewTestServerPort } from '../utils/getNewTestServerPort';
import { Tester } from '../services/test/Tester';
import { clientConfigService } from '@modules/common';
import sessionDataMiddleware from './middleware/sessiondata';
import { TechnicianController } from './TechnicianController';
import { CrowdServiceResponse } from '@modules/data-access/services/CrowdServiceApi';
import { exampleTechnicianDto, TechnicianDto } from '@modules/data-access/models/Technician';
import { TEST_APP_CONFIG } from '../testAppConfig';
import { omit } from 'utils/omit';
import { Address } from '@modules/data-access/models';
import { exampleSkill, Skill } from '@modules/data-access/models/Skill';
import { exampleNewSkillCertificate } from '@modules/data-access/models/SkillCertificate';

const PORT = getNewTestServerPort();
const server = express()
  .use(bodyParser.json())
  .use(sessionDataMiddleware())
  .post('/portal/data/technicians', TechnicianController.create)
  .get('/portal/data/technicians', TechnicianController.readAll)
  .get('/portal/data/technician/:technicianId', TechnicianController.read)
  .delete('/portal/data/technician/:technicianId', TechnicianController.remove)
  .put('/portal/data/technicians/:technicianId', TechnicianController.update)
  .post('/portal/data/technician/:technicianId/skills', TechnicianController.assignSkill)
  .get('/portal/data/technician/:technicianId/skills', TechnicianController.readSkills)
  .delete('/portal/data/technician/:technicianId/skills/:skillId', TechnicianController.removeSkill)
  .listen(PORT);

const tester = new Tester({
  url: 'http://127.0.0.1',
  port: PORT,
});

after(() => server.close());

beforeEach(() => {
  clientConfigService.setConfig(TEST_APP_CONFIG);
});

describe('TechnicianController', () => {
  describe('readAll()', () => {
    it('sends correct backend request', done => {
      const technician = exampleTechnicianDto();
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd/v2/technicians?size=120${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, {
            results: [technician],
          } as Partial<CrowdServiceResponse<TechnicianDto>>),
      ];

      tester.get('/portal/data/technicians')
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(response, [
            technician,
          ]);
          done();
        });
    });
  });

  describe('remove()', () => {
    it('sends correct backend request', done => {
      const technician = exampleTechnicianDto();
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .delete(`/cloud-crowd-service/api/crowd/v2/technicians/external-id/${technician.externalId}${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200),
      ];

      tester.delete(`/portal/data/technician/${technician.externalId}`)
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse(() => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          done();
        });
    });
  });

  describe('read()', () => {
    it('sends correct backend request', done => {
      const technician = exampleTechnicianDto();
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd/v2/technicians/external-id/${technician.externalId}${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [technician],
          } as Partial<CrowdServiceResponse<TechnicianDto>>),
      ];

      tester.get(`/portal/data/technician/${technician.externalId}`)
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(response, technician);
          done();
        });
    });
  });

  describe('update()', () => {
    it('sends correct backend request', done => {
      const technician = exampleTechnicianDto();
      const skillToAdd = exampleSkill('TAG1');
      const skillToRemove = exampleSkill('TAG2');
      const certificateToUpload = exampleNewSkillCertificate('TAG1');
      const skillToRemoveCertificateFrom = {...exampleSkill(), uuid: 'SKILL-DELETE-ME'};
      const requestBody = {
        requests: [
          {
            requestId: 0,
            operation: 'CREATE',
            skill: skillToAdd
          },
          {
            requestId: 1,
            operation: 'UPDATE',
            skill: {
              ...skillToRemoveCertificateFrom,
              certificate: null,
            }
          },
          {
            requestId: 2,
            operation: 'DELETE',
            skill: skillToRemove
          }
        ]
      };
      const batchAddAndRemoveSkills = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
        .post(
          `/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/skills/actions/batch${TestConfigurationService.requestQuerySuffix()}`,
          b => JSON.stringify(b) === JSON.stringify(requestBody)
        )
        .reply(200, {results: []});

      const updateTechnician = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
        .put(`/cloud-crowd-service/api/crowd/v2/technicians/external-id/${technician.externalId}${TestConfigurationService.requestQuerySuffix()}`)
        .reply(200, {
          results: [technician],
        } as Partial<CrowdServiceResponse<TechnicianDto>>);
      const updateTechnicianAddress = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
        .put(`/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/addresses/${technician.address.id}${TestConfigurationService.requestQuerySuffix()}`)
        .reply(200, {
          results: [technician.address],
        } as Partial<CrowdServiceResponse<Address>>);
      const uploadCertificates = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
        .post(`/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/skills/${certificateToUpload.skillId}/certificates${TestConfigurationService.requestQuerySuffix()}`)
        .reply(200, {} as Partial<CrowdServiceResponse<{}>>);
      const nockScopes = [
        batchAddAndRemoveSkills,
        uploadCertificates,
        updateTechnician,
        updateTechnicianAddress,
        uploadCertificates,
      ];

      tester.put(`/portal/data/technicians/${technician.externalId}`)
        .send({
          profile: omit(exampleTechnicianDto(), 'skills', 'businessPartner', 'createdAt'),
          skills: {
            add: [skillToAdd],
            remove: [skillToRemove],
          },
          certificates: {
            add: [certificateToUpload],
            remove: [skillToRemoveCertificateFrom],
          },
        })
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse(response => {
          nockScopes.forEach(scope => assert(scope.isDone(), `Not all nock scopes have been called! ${scope.pendingMocks()}`));
          assert.deepEqual(response, technician);
          done();
        });
    });
  });

  describe('create()', () => {
    it('sends correct backend request', done => {
      const technician = exampleTechnicianDto();
      const skill = exampleSkill('TAG1');
      const certificate = exampleNewSkillCertificate('Skill1');

      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/skills/actions/batch${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {results: []}),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/skills/${certificate.skillId}/certificates${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [],
          }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/cloud-crowd-service/api/crowd/v2/technicians${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [technician],
          } as Partial<CrowdServiceResponse<TechnicianDto>>),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd/v2/technicians/external-id/${technician.externalId}${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [technician],
          } as Partial<CrowdServiceResponse<TechnicianDto>>),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/addresses${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [technician.address],
          } as Partial<CrowdServiceResponse<Address>>),
      ];

      tester.post(`/portal/data/technicians`)
        .send({
          profile: omit({
            ...technician,
            address: omit(technician.address, 'id'),
          }, 'skills', 'businessPartner', 'createdAt', 'externalId'),
          skills: [skill],
          certificates: [certificate],
        })
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse(response => {
          nockScopes.forEach(scope => assert(scope.isDone(), `Not all nock scopes have been called! ${scope.pendingMocks()}`));
          assert.deepEqual(response, technician);
          done();
        });
    });
  });

  describe('readSkills()', () => {
    it('sends correct backend request', done => {
      const technicianId = '12345';
      const skill = exampleSkill();
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd/v2/technicians/${technicianId}/skills${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [skill],
          } as Partial<CrowdServiceResponse<Skill>>),
      ];

      tester.get(`/portal/data/technician/${technicianId}/skills`)
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse(response => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(response, [skill]);
          done();
        });
    });
  });

  describe('assignSkill()', () => {
    it('sends correct backend request', done => {
      const technicianId = '12345';
      const skill = exampleSkill();
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/cloud-crowd-service/api/crowd/v2/technicians/${technicianId}/skills${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [skill],
          } as Partial<CrowdServiceResponse<Skill>>),
      ];

      tester.post(`/portal/data/technician/${technicianId}/skills`)
        .send({tagExternalId: skill.tagExternalId})
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse(response => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(response, skill);
          done();
        });
    });
  });

  describe('removeSkill()', () => {
    it('sends correct backend request', done => {
      const technicianId = '12345';
      const skill = exampleSkill();
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd/v2/technicians/${technicianId}/skills${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [skill],
          }),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .delete(`/cloud-crowd-service/api/crowd/v2/technicians/${technicianId}/skills/${skill.uuid}${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200),
      ];

      tester.delete(`/portal/data/technician/${technicianId}/skills/${skill.tagExternalId}`)
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse(response => {
          nockScopes.forEach(scope => {
            assert(scope.isDone(), 'Not all nock scopes have been called!');
          });
          done();
        });
    });
  });
});
