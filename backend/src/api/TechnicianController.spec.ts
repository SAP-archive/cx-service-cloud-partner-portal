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
import { exampleTechnicianDto, exampleTechnicianSearchResult, TechnicianDto } from '@modules/data-access/models/Technician';
import { TEST_APP_CONFIG } from '../testAppConfig';
import { omit } from 'utils/omit';
import { exampleSkill, Skill } from '@modules/data-access/models/Skill';
import { exampleNewSkillCertificate } from '@modules/data-access/models/SkillCertificate';
import { TechniciansCreationCounterService } from '../metrics/technicians-creation/TechniciansCreationCounterService';
import { SinonStub, stub } from 'sinon';

const PORT = getNewTestServerPort();
const server = express()
  .use(bodyParser.json())
  .use(sessionDataMiddleware())
  .post('/portal/data/technicians', TechnicianController.create)
  .get('/portal/data/technicians', TechnicianController.readAll)
  .post('/portal/search/technicians', TechnicianController.search)
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
          .get(`/cloud-crowd-service/api/crowd/v2/technicians?size=1000${TestConfigurationService.requestQuerySuffix('&')}`)
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

  describe('search()', () => {
    it('sends correct backend request', done => {
      const techniciansSearched = exampleTechnicianSearchResult();
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd/v2/technicians?page=0&size=5&name=technicianName&externalId=technicianId${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, techniciansSearched),
      ];

      tester.post('/portal/search/technicians')
        .send({page: 0, size: 5, name: 'technicianName', externalId: 'technicianId'})
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(response, techniciansSearched);
          done();
        });
    });
  });

  describe('remove()', () => {
    it('sends correct backend request', done => {
      const technician = exampleTechnicianDto();
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd/v2/technicians/external-id/${technician.externalId}${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [technician],
          } as Partial<CrowdServiceResponse<TechnicianDto>>),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .delete(`/cloud-crowd-service/api/crowd/v2/technicians/external-id/${technician.externalId}${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .delete(`/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/addresses/${technician.address.id}${TestConfigurationService.requestQuerySuffix()}`)
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
    describe('address cases', () => {
      it('sends correct backend request to update technician with valid address', done => {
        let technician = exampleTechnicianDto();
        const skillToAdd1 = exampleSkill('TAG1', '001');
        const skillToAdd2 = exampleSkill('TAG2', '002');
        const skillToRemove = exampleSkill('TAG3');
        const certificateToUpload1 = exampleNewSkillCertificate('TAG2', '002');
        const certificateToUpload2 = exampleNewSkillCertificate('TAG4', '004');
        const skillToRemoveCertificateFrom = {...exampleSkill('TAG5'), uuid: 'SKILL-DELETE-ME'};
        const expectedBatchReqBody = {
          requests: [
            {
              requestId: 0,
              operation: 'CREATE',
              skill: skillToAdd1,
            },
            {
              requestId: 1,
              operation: 'DELETE',
              skill: skillToRemove,
            },
            {
              requestId: 2,
              operation: 'UPDATE',
              skill: {...skillToRemoveCertificateFrom, certificate: null},
            },
          ],
        };
        const postSkillsInBatch = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(
            `/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/skills/actions/batch${TestConfigurationService.requestQuerySuffix()}`,
            requestBody => JSON.stringify(requestBody) === JSON.stringify(expectedBatchReqBody))
          .reply(200, {results: []});
        const postSkill = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/skills${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {results: []});
        const uploadCertificates = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/skills/${certificateToUpload2.skillId}/certificates${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {} as Partial<CrowdServiceResponse<{}>>);
        const changeRole = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/cloud-crowd-service/api/crowd-partner/v1/users/${technician.externalId}/actions/change-role${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {results: [{crowdUserType: 'PARTNER_TECHNICIAN'}]} as Partial<CrowdServiceResponse<{}>>);
        const nockScopes = [
          postSkillsInBatch,
          postSkill,
          uploadCertificates,
          changeRole,
        ];

        const updateTechnician = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .put(`/cloud-crowd-service/api/crowd/v2/technicians/external-id/${technician.externalId}${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [technician],
          } as Partial<CrowdServiceResponse<TechnicianDto>>);
        nockScopes.push(updateTechnician);
        tester.put(`/portal/data/technicians/${technician.externalId}`)
          .send({
            profile: omit(exampleTechnicianDto(), 'skills', 'businessPartner', 'createdAt'),
            skills: {
              add: [skillToAdd1, skillToAdd2],
              remove: [skillToRemove],
            },
            certificates: {
              add: [certificateToUpload1, certificateToUpload2],
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

      it('sends correct backend request to update technician with empty address', done => {
        let technician = exampleTechnicianDto();
        const skillToAdd1 = exampleSkill('TAG1', '001');
        const skillToAdd2 = exampleSkill('TAG2', '002');
        const skillToRemove = exampleSkill('TAG3');
        const certificateToUpload1 = exampleNewSkillCertificate('TAG2', '002');
        const certificateToUpload2 = exampleNewSkillCertificate('TAG4', '004');
        const skillToRemoveCertificateFrom = {...exampleSkill('TAG5'), uuid: 'SKILL-DELETE-ME'};
        const expectedBatchReqBody = {
          requests: [
            {
              requestId: 0,
              operation: 'CREATE',
              skill: skillToAdd1,
            },
            {
              requestId: 1,
              operation: 'DELETE',
              skill: skillToRemove,
            },
            {
              requestId: 2,
              operation: 'UPDATE',
              skill: {...skillToRemoveCertificateFrom, certificate: null},
            },
          ],
        };
        const postSkillsInBatch = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(
            `/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/skills/actions/batch${TestConfigurationService.requestQuerySuffix()}`,
            requestBody => JSON.stringify(requestBody) === JSON.stringify(expectedBatchReqBody))
          .reply(200, {results: []});
        const postSkill = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/skills${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {results: []});
        const uploadCertificates = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/skills/${certificateToUpload2.skillId}/certificates${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {} as Partial<CrowdServiceResponse<{}>>);
        const changeRole = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/cloud-crowd-service/api/crowd-partner/v1/users/${technician.externalId}/actions/change-role${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {results: [{crowdUserType: 'PARTNER_TECHNICIAN'}]} as Partial<CrowdServiceResponse<{}>>);
        const nockScopes = [
          postSkillsInBatch,
          postSkill,
          uploadCertificates,
          changeRole,
        ];

        const addressId = 'xxxx-xxxx-xxxx-xxxx';
        technician = {...technician, address: {
          id: addressId,
          streetName: '',
          zipCode: '',
          city: '',
          country: '',
          number: '',
        }};
        const updateTechnician = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .put(`/cloud-crowd-service/api/crowd/v2/technicians/external-id/${technician.externalId}${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, {
            results: [{...technician, address: null}],
          } as Partial<CrowdServiceResponse<TechnicianDto>>);
        const deleteAddress = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .delete(`/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/addresses/${addressId}${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200);
        nockScopes.push(uploadCertificates);
        nockScopes.push(deleteAddress);

        tester.put(`/portal/data/technicians/${technician.externalId}`)
          .send({
            profile: omit(technician, 'skills', 'businessPartner', 'createdAt'),
            skills: {
              add: [skillToAdd1, skillToAdd2],
              remove: [skillToRemove],
            },
            certificates: {
              add: [certificateToUpload1, certificateToUpload2],
              remove: [skillToRemoveCertificateFrom],
            },
          })
          .expectStatus(200)
          .with('headers', TestConfigurationService.HEADERS)
          .assertResponse(response => {
            nockScopes.forEach(scope => assert(scope.isDone(), `Not all nock scopes have been called! ${scope.pendingMocks()}`));
            assert.deepEqual(response, {...technician, address: null});
            done();
          });
      });
    });

    it('should update without a certificate', done => {
      const technician = exampleTechnicianDto();
      const skillToAdd = exampleSkill('TAG1');
      const skillToRemove = exampleSkill('TAG2');
      const skillToRemoveCertificateFrom = {...exampleSkill(), uuid: 'SKILL-DELETE-ME'};
      const expectedBatchReqBody = {
        requests: [
          {
            requestId: 0,
            operation: 'CREATE',
            skill: skillToAdd,
          },
          {
            requestId: 1,
            operation: 'DELETE',
            skill: skillToRemove,
          },
          {
            requestId: 2,
            operation: 'UPDATE',
            skill: {
              ...skillToRemoveCertificateFrom,
              certificate: null,
            },
          },
        ],
      };
      const batchAddAndRemoveSkills = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
        .post(
          `/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/skills/actions/batch${TestConfigurationService.requestQuerySuffix()}`,
          requestBody => JSON.stringify(requestBody) === JSON.stringify(expectedBatchReqBody),
        )
        .reply(200, {results: []});
      const updateTechnician = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
        .put(`/cloud-crowd-service/api/crowd/v2/technicians/external-id/${technician.externalId}${TestConfigurationService.requestQuerySuffix()}`)
        .reply(200, {
          results: [technician],
        } as Partial<CrowdServiceResponse<TechnicianDto>>);
      const changeRole = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
        .post(`/cloud-crowd-service/api/crowd-partner/v1/users/${technician.externalId}/actions/change-role${TestConfigurationService.requestQuerySuffix()}`)
        .reply(200, {results: [{crowdUserType: 'PARTNER_TECHNICIAN'}]} as Partial<CrowdServiceResponse<{}>>);
      const nockScopes = [
        batchAddAndRemoveSkills,
        updateTechnician,
        changeRole,
      ];

      tester.put(`/portal/data/technicians/${technician.externalId}`)
        .send({
          profile: omit(exampleTechnicianDto(), 'skills', 'businessPartner', 'createdAt'),
          skills: {
            add: [skillToAdd],
            remove: [skillToRemove],
          },
          certificates: {
            add: [],
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
    let counterServiceStub: SinonStub;

    beforeEach(() => counterServiceStub = stub(TechniciansCreationCounterService, 'countCreation'));
    afterEach(() => counterServiceStub.restore());

    describe('address cases', () => {
      it('sends correct backend request to create technician with valid address', done => {
        const technician = exampleTechnicianDto();
        const skill = exampleSkill('TAG1');
        const certificate = exampleNewSkillCertificate('', skill.viewModelId);

        const nockScopes = [
          nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
            .post(`/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/skills${TestConfigurationService.requestQuerySuffix()}`)
            .reply(200, {results: []}),
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
        ];
        tester.post(`/portal/data/technicians`)
          .send({
            profile: omit({
              ...technician,
              address: omit(technician.address, 'id'),
            }, 'skills', 'businessPartner', 'createdAt', 'externalId', 'crowdType'),
            skills: [skill],
            certificates: [certificate],
          })
          .expectStatus(200)
          .with('headers', TestConfigurationService.HEADERS)
          .assertResponse(response => {
            nockScopes.forEach(scope => assert(scope.isDone(), `Not all nock scopes have been called! ${scope.pendingMocks()}`));
            assert.deepEqual(response, technician);
            assert.equal(
              counterServiceStub.calledWith({
                crowdAccountId: TestConfigurationService.HEADERS['x-cloud-account-id'],
                cloudHost: TestConfigurationService.HEADERS['x-cloud-host'],
              }),
              true);
            done();
          });
      });

      it('sends correct backend request to create technician with empty address', done => {
        const technician = {
          ...exampleTechnicianDto(),
          address: {
            id: null,
            streetName: '',
            zipCode: '',
            city: '',
            country: '',
            number: '',
          }
        };
        const skill = exampleSkill('TAG1');
        const certificate = exampleNewSkillCertificate('', skill.viewModelId);

        const nockScopes = [
          nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
            .post(`/cloud-crowd-service/api/crowd/v2/technicians/${technician.externalId}/skills${TestConfigurationService.requestQuerySuffix()}`)
            .reply(200, {results: []}),
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
        ];

        tester.post(`/portal/data/technicians`)
          .send({
            profile: omit({
              ...technician,
              address: omit(technician.address, 'id'),
            }, 'skills', 'businessPartner', 'createdAt', 'externalId', 'crowdType'),
            skills: [skill],
            certificates: [certificate],
          })
          .expectStatus(200)
          .with('headers', TestConfigurationService.HEADERS)
          .assertResponse(response => {
            nockScopes.forEach(scope => assert(scope.isDone(), `Not all nock scopes have been called! ${scope.pendingMocks()}`));
            assert.deepEqual(response, technician);
            assert.equal(
              counterServiceStub.calledWith({
                crowdAccountId: TestConfigurationService.HEADERS['x-cloud-account-id'],
                cloudHost: TestConfigurationService.HEADERS['x-cloud-host'],
              }),
              true);
            done();
          });
      });
    });
  });

  describe('readSkills()', () => {
    it('sends correct backend request', done => {
      const technicianId = '12345';
      const skill = exampleSkill();
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd/v2/technicians/${technicianId}/skills${TestConfigurationService.requestQuerySuffix()}&page=0&size=1000`)
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
