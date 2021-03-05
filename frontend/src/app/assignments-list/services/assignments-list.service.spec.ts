import { AssignmentsListService } from './assignments-list.service';
import { AppBackendService } from 'src/app/services/app-backend.service';
import { HttpResponse } from '@angular/common/http';
import { AssignmentsListFacadeMockBuilder } from '../state/assignments-list.facade.mock.spec';
import { marbles } from 'rxjs-marbles';
import { CrowdApiResponse } from '../../technicians-list-module/models/crowd-api-response.model';
import { Assignment, exampleAssignment } from '../model/assignment';
import { exampleFetchingParams, FetchingParams } from '../model/fetching-params.model';
import { AssignmentsListFacade } from '../state/assignments-list.facade';
import { of } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('AssignmentsService', () => {
  let assignmentsService: AssignmentsListService;
  let appBackendMockService: jasmine.SpyObj<AppBackendService>;
  let mockAssignmentsListFacade: SpyObj<AssignmentsListFacade> = new AssignmentsListFacadeMockBuilder().build();

  beforeEach(() => {
    appBackendMockService = jasmine.createSpyObj(AppBackendService, ['get', 'post']);
    assignmentsService = new AssignmentsListService(appBackendMockService, mockAssignmentsListFacade);
  });

  describe('loadNextPage()', () => {
    it('calls the backend service', marbles(m => {
      const exampleResponse = (): CrowdApiResponse<Assignment> => ({
        results: [exampleAssignment()],
      });

      const fetchingParams: FetchingParams = {
        ...exampleFetchingParams(),
        filter: {
          partnerDispatchingStatus: 'NOTIFIED',
        },
      };
      mockAssignmentsListFacade.getFetchingParams.and.returnValue(of(fetchingParams));

      appBackendMockService.get
        .withArgs(`/assignments?page=${fetchingParams.pagesLoaded}&size=50&filter=${JSON.stringify(fetchingParams.filter)}`)
        .and.returnValue(m.cold('a|', {
        a: new HttpResponse({
          body: exampleResponse(),
        }),
      }));

      m.expect(assignmentsService.loadNextPage('ASSIGNMENTS_BOARD_NEW')).toBeObservable('a|', {a: exampleResponse()});
    }));
  });

  describe('reject()', () => {
    it('calls the backend service for reject', marbles(m => {
      appBackendMockService.post
        .withArgs(`/assignments/${exampleAssignment().id}/actions/reject`, exampleAssignment())
        .and.returnValue(m.cold('a|', {
        a: new HttpResponse({
          body: exampleAssignment(),
        }),
      }));

      m.expect(assignmentsService.dispatch(exampleAssignment(), 'reject')).toBeObservable('a|', {a: exampleAssignment()});
    }));
  });

  describe('accept()', () => {
    it('calls the backend service for accept', marbles(m => {
      appBackendMockService.post
        .withArgs(`/assignments/${exampleAssignment().id}/actions/accept`, exampleAssignment())
        .and.returnValue(m.cold('a|', {
        a: new HttpResponse({
          body: exampleAssignment(),
        }),
      }));

      m.expect(assignmentsService.dispatch(exampleAssignment(), 'accept')).toBeObservable('a|', {a: exampleAssignment()});
    }));
  });

  describe('handover()', () => {
    it('calls the backend service for handover', marbles(m => {
      appBackendMockService.post
        .withArgs(`/assignments/${exampleAssignment().id}/actions/handover`, exampleAssignment())
        .and.returnValue(m.cold('a|', {
        a: new HttpResponse({
          body: exampleAssignment('updated'),
        }),
      }));

      m.expect(assignmentsService.handover(exampleAssignment()))
        .toBeObservable('a|', {a: exampleAssignment('updated')});
    }));
  });

  describe('update()', () => {
    it('calls the backend service for update', marbles(m => {
      appBackendMockService.post
        .withArgs(`/assignments/${exampleAssignment().id}/actions/update`, exampleAssignment())
        .and.returnValue(m.cold('a|', {
        a: new HttpResponse({
          body: exampleAssignment(),
        }),
      }));

      m.expect(assignmentsService.dispatch(exampleAssignment(), 'update')).toBeObservable('a|', {a: exampleAssignment()});
    }));
  });

  describe('syncStatusError', () => {
    it('should return syncError when syncStatus is BLOCKED', marbles(m => {
      const cloudSyncError = {
        error: { message: 'ASSIGNMENTS_SYNC_STATUS_ERROR'}
      };
      const blockedAssignment: Assignment = { ...exampleAssignment(), syncStatus: 'BLOCKED' };
      m.expect(assignmentsService.dispatch(blockedAssignment, 'update')).toBeObservable('#', {}, cloudSyncError);
    }));
  });
});
