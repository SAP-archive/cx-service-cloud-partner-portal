import express = require('express');
import bodyParser = require('body-parser');
import nock = require('nock');
import assert = require('assert');
import TestConfigurationService = require('../services/test/TestConfigurationService');
import { getNewTestServerPort } from '../utils/getNewTestServerPort';
import { Tester } from '../services/test/Tester';
import { clientConfigService } from '@modules/common';
import sessionDataMiddleware from './middleware/sessiondata';
import { AssignmentsController } from './AssignmentsController';
import { TEST_APP_CONFIG } from '../testAppConfig';
import { CrowdDispatchingApiResponse } from '@modules/data-access/services/CrowdDispatchingApi';
import { AssignmentDTO, exampleAssignmentDTO } from '../models/AssignmentDTO';
import { Assignment, exampleAssignment } from '../models/Assignment';
import { AssignmentsStats } from '../models/AssignmentsStats';
import { exampleTechnicianDto } from '@modules/data-access/models/Technician';

const PORT = getNewTestServerPort();
const server = express()
  .use(bodyParser.json())
  .use(sessionDataMiddleware())
  .get('/portal/assignments', AssignmentsController.fetchAssignments)
  .get('/portal/assignments-stats', AssignmentsController.fetchAssignmentsStats)
  .post('/portal/assignments/:assignmentId/actions/update', AssignmentsController.updateAssignment)
  .post('/portal/assignments/:assignmentId/actions/reject', AssignmentsController.rejectAssignment)
  .post('/portal/assignments/:assignmentId/actions/accept', AssignmentsController.acceptAssignment)
  .post('/portal/assignments/:assignmentId/actions/close', AssignmentsController.closeAssignment)
  .post('/portal/assignments/:assignmentId/actions/release', AssignmentsController.releaseAssignment)
  .listen(PORT);

const tester = new Tester({
  url: 'http://127.0.0.1',
  port: PORT,
});

after(() => server.close());

beforeEach(() => {
  clientConfigService.setConfig(TEST_APP_CONFIG);
});

describe('AssignmentsController', () => {
  describe('fetchAssignments()', () => {
    it('should send a correct backend request', done => {
      const assignmentDtosResponse = () => ({
        results: [exampleAssignmentDTO()],
        totalElements: 1,
        totalPages: 1,
        numberOfElements: 1,
      } as Partial<CrowdDispatchingApiResponse<AssignmentDTO>>);

      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-partner-dispatch-service/api/v1/assignment-details?page=1&size=10&partnerDispatchingStatus=ACCEPTED&ServiceAssignmentState=CLOSED${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, assignmentDtosResponse()),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd/v2/technicians?page=1&size=10&name=&externalId=${exampleTechnicianDto().externalId}${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, {results: [exampleTechnicianDto()]}),
      ];

      tester.get(`/portal/assignments?page=1&size=10&filter=${JSON.stringify({partnerDispatchingStatus: 'ACCEPTED', ServiceAssignmentState: 'CLOSED'})}`)
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(
            response,
            {
              results: [exampleAssignment()],
              totalElements: 1,
              totalPages: 1,
              numberOfElements: 1,
            } as Partial<CrowdDispatchingApiResponse<Assignment>>,
          );
          done();
        });
    });
  });

  describe('fetchAssignmentsStats()', () => {
    it('should collect the stats', done => {
      const assignmentDtosResponse = (totalElements: number) => ({
        results: [],
        totalElements,
      } as Partial<CrowdDispatchingApiResponse<AssignmentDTO>>);

      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-partner-dispatch-service/api/v1/assignment-details?page=0&size=1&partnerDispatchingStatus=NOTIFIED&serviceAssignmentState=ASSIGNED${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, assignmentDtosResponse(1)),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-partner-dispatch-service/api/v1/assignment-details?page=0&size=1&partnerDispatchingStatus=ACCEPTED&serviceAssignmentState=ASSIGNED${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, assignmentDtosResponse(2)),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-partner-dispatch-service/api/v1/assignment-details?page=0&size=1&partnerDispatchingStatus=ACCEPTED&serviceAssignmentState=RELEASED${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, assignmentDtosResponse(3)),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-partner-dispatch-service/api/v1/assignment-details?page=0&size=1&partnerDispatchingStatus=ACCEPTED&serviceAssignmentState=CLOSED${TestConfigurationService.requestQuerySuffix('&')}`)
          .reply(200, assignmentDtosResponse(4)),
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .get(`/cloud-crowd-service/api/crowd/v2/technicians?page=0&size=1&name=&externalId=${TestConfigurationService.requestQuerySuffix('&')}`)
          .times(4)
          .reply(200, {results: []}),
      ];

      tester.get(`/portal/assignments-stats`)
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(
            response,
            {
              newCount: 1,
              readyToPlanCount: 2,
              ongoingCount: 3,
              closedCount: 4,
            } as AssignmentsStats,
          );
          done();
        });
    });
  });

  describe('updateAssignment()', () => {
    it('should send update request', done => {
      const assignmentResponse = () => ({
        results: [exampleAssignment()],
      } as Partial<CrowdDispatchingApiResponse<Assignment>>);

      const updateAssignment = nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
        .put(`/cloud-partner-dispatch-service/api/v1/assignment-details/${exampleAssignment().id}${TestConfigurationService.requestQuerySuffix()}`)
        .reply(200, assignmentResponse());

      const nockScopes = [
        updateAssignment,
      ];

      tester.post(`/portal/assignments/${exampleAssignment().id}/actions/update`)
        .send({
          ...exampleAssignment(),
        })
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(
            response,
            exampleAssignment(),
          );
          done();
        });
    });
  });

  describe('dispatchAssignment', () => {
    it('should send reject request', done => {
      const assignmentResponse = () => ({
        results: [exampleAssignment()],
      } as Partial<CrowdDispatchingApiResponse<Assignment>>);

      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/cloud-partner-dispatch-service/api/partner-dispatch/v1/reject${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, assignmentResponse()),
      ];

      tester.post(`/portal/assignments/${exampleAssignment().id}/actions/reject`)
        .send({
          ...exampleAssignment(),
        })
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(
            response,
            { ...exampleAssignment(), partnerDispatchingStatus: 'REJECTED' },
          );
          done();
        });
    });

    it('should send accept request', done => {
      const assignmentResponse = () => ({
        results: [exampleAssignment()],
      } as Partial<CrowdDispatchingApiResponse<Assignment>>);

      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/cloud-partner-dispatch-service/api/partner-dispatch/v1/accept${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, assignmentResponse()),
      ];

      tester.post(`/portal/assignments/${exampleAssignment().id}/actions/accept`)
        .send({
          ...exampleAssignment(),
        })
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(
            response,
            { ...exampleAssignment(), partnerDispatchingStatus: 'ACCEPTED' },
          );
          done();
        });
    });

    it('should send release request', done => {
      const releasedAssignment: Assignment = { ...exampleAssignment(), serviceAssignmentState: 'RELEASED' };
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain}`)
          .post(`/cloud-partner-dispatch-service/api/partner-dispatch/v1/release${TestConfigurationService.requestQuerySuffix()}`)
          .reply(200, releasedAssignment),
      ];

      tester.post(`/portal/assignments/${exampleAssignment().id}/actions/release`)
        .send({
          ...exampleAssignment(),
        })
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(
            response,
            releasedAssignment,
          );
          done();
        });
    });
  });

  describe('closeAssignment()', () => {
    it('should send close request', done => {
      const closedAssignment = {...exampleAssignment(), serviceAssignmentState: 'CLOSED'};
      const nockScopes = [
        nock(`https://${TEST_APP_CONFIG.backendClusterDomain.split('.')[0]}.coresystems.net`)
          .post(`/api/service-management/v2/activities/${exampleAssignment().id}/actions/close`)
          .reply(200, closedAssignment),
      ];

      tester.post(`/portal/assignments/${exampleAssignment().id}/actions/close`)
        .send({
          ...exampleAssignment(),
        })
        .expectStatus(200)
        .with('headers', TestConfigurationService.HEADERS)
        .assertResponse((response) => {
          nockScopes.forEach(scope => assert(scope.isDone(), 'Not all nock scopes have been called!'));
          assert.deepEqual(
            response,
            closedAssignment,
          );
          done();
        });
    });
  });
});
