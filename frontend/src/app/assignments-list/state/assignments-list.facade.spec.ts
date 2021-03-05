import { TestBed } from '@angular/core/testing';
import { AssignmentsListFacade } from './assignments-list.facade';
import { Store, StoreModule } from '@ngrx/store';
import * as fromAssignments from './assignments-list.reducer';
import * as fromMain from './assignments-list.reducer';
import { AssignmentsListService } from '../services/assignments-list.service';
import { EffectsModule } from '@ngrx/effects';
import { AssignmentsListEffects } from './assignments-list.effects';
import { marbles } from 'rxjs-marbles/jasmine';
import { Assignment, exampleAssignment } from '../model/assignment';
import { CrowdApiResponse } from '../../technicians-list-module/models/crowd-api-response.model';
import {
  getFetchingParamsFromColumnState,
  selectMainState,
  selectNewAssignmentsState,
  selectOngoingState,
  selectReadyToPlanState,
} from './assignments-list.selectors';
import * as AssignmentsActions from './assignments-list.actions';
import { accept, release } from './assignments-list.actions';
import { DispatchingStatus } from '../model/dispatching-status';
import { ServiceAssignmentState } from '../model/service-assignment-state';
import { exampleFetchingFilter } from '../model/fetching-filter';
import { throwError } from 'rxjs';
import { reducers } from './assignments-list.state';
import * as fromNewAssignments from './columns-reducers/new-assignments.reducer';
import * as fromReadyToPlan from './columns-reducers/ready-to-plan-assignments.reducer';
import * as fromOngoing from './columns-reducers/ongoing-assignments.reducer';
import * as fromClosed from './columns-reducers/closed-assignments.reducer';
import { ColumnName } from '../model/column-name';
import { emptyFetchingParams } from '../model/fetching-params.model';
import SpyObj = jasmine.SpyObj;

describe('AssignmentsFacade', () => {
  let facadeService: AssignmentsListFacade;
  let store: Store;
  let assignmentsListServiceMock: SpyObj<AssignmentsListService>;

  const loadDataForAllColumns = () => {
    facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');
    facadeService.loadNextPage('ASSIGNMENTS_BOARD_READY_TO_PLAN');
    facadeService.loadNextPage('ASSIGNMENTS_BOARD_ONGOING');
    facadeService.loadNextPage('ASSIGNMENTS_BOARD_CLOSED');
  };

  const exampleAssignments = (partnerDispatchingStatus: DispatchingStatus = 'NOTIFIED', serviceAssignmentState: ServiceAssignmentState = 'ASSIGNED') => [
    exampleAssignment('1', partnerDispatchingStatus, serviceAssignmentState),
    exampleAssignment('2', partnerDispatchingStatus, serviceAssignmentState),
  ];

  beforeEach(() => {
    assignmentsListServiceMock = jasmine.createSpyObj<AssignmentsListService>(['loadNextPage', 'dispatch', 'handover']);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(fromAssignments.assignmentsListFeatureKey, reducers),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([AssignmentsListEffects]),
      ],
      providers: [
        AssignmentsListFacade,
        {
          provide: AssignmentsListService,
          useValue: assignmentsListServiceMock,
        },
      ],
    });

    facadeService = TestBed.inject(AssignmentsListFacade);
    store = TestBed.inject(Store);
  });

  describe('loadNextPage()', () => {
    it('should populate state with fetched new assignments', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments()},
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_NEW')).toBeObservable('ea', {
        e: [],
        a: exampleAssignments(),
      });
    }));

    it('should populate state with fetched ready to plan assignments', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments('ACCEPTED')},
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_READY_TO_PLAN');

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('ea', {
        e: [],
        a: exampleAssignments('ACCEPTED'),
      });
    }));

    it('should populate state with fetched ongoing assignments', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments('ACCEPTED', 'RELEASED')},
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_ONGOING');

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('ea', {
        e: [],
        a: exampleAssignments('ACCEPTED', 'RELEASED'),
      });
    }));

    it('should populate state with fetched closed assignments', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments('ACCEPTED', 'CLOSED')},
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_CLOSED');

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_CLOSED')).toBeObservable('ea', {
        e: [],
        a: exampleAssignments('ACCEPTED', 'CLOSED'),
      });
    }));

    describe('getIsLoading() should emit true and then false', () => {
      it('when next page loads correctly', marbles(m => {
        m.expect(facadeService.getIsLoading('ASSIGNMENTS_BOARD_NEW')).toBeObservable('(ftf)', {t: true, f: false});
        m.expect(facadeService.getIsLoading('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('(ftf)', {
          t: true,
          f: false,
        });
        m.expect(facadeService.getIsLoading('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('(ftf)', {t: true, f: false});
        m.expect(facadeService.getIsLoading('ASSIGNMENTS_BOARD_CLOSED')).toBeObservable('(ftf)', {t: true, f: false});

        assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('a|', {
          a: {results: exampleAssignments()},
        }));
        loadDataForAllColumns();
      }));

      it(`when there's an error while loading next page`, marbles(m => {
        m.expect(facadeService.getIsLoading('ASSIGNMENTS_BOARD_NEW')).toBeObservable('(ftf)', {t: true, f: false});
        m.expect(facadeService.getIsLoading('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('(ftf)', {
          t: true,
          f: false,
        });
        m.expect(facadeService.getIsLoading('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('(ftf)', {t: true, f: false});
        m.expect(facadeService.getIsLoading('ASSIGNMENTS_BOARD_CLOSED')).toBeObservable('(ftf)', {t: true, f: false});

        assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('#|'));
        loadDataForAllColumns();
      }));
    });

    it('should set fetching params in all column states', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-v|', {
        v: {
          results: exampleAssignments(),
          numberOfElements: 2,
          totalElements: 2,
          totalPages: 1,
        } as CrowdApiResponse<Assignment>,
      }));
      loadDataForAllColumns();

      m.expect(facadeService.getFetchingParams('ASSIGNMENTS_BOARD_NEW')).toBeObservable('iv', {
        i: getFetchingParamsFromColumnState(fromNewAssignments.initialState()),
        v: {pagesLoaded: 1, totalPages: 1, totalElements: 2, filter: null},
      });

      m.expect(facadeService.getFetchingParams('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('iv', {
        i: getFetchingParamsFromColumnState(fromNewAssignments.initialState()),
        v: {pagesLoaded: 1, totalPages: 1, totalElements: 2, filter: null},
      });

      m.expect(facadeService.getFetchingParams('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('iv', {
        i: getFetchingParamsFromColumnState(fromOngoing.initialState()),
        v: {pagesLoaded: 1, totalPages: 1, totalElements: 2, filter: null},
      });

      m.expect(facadeService.getFetchingParams('ASSIGNMENTS_BOARD_CLOSED')).toBeObservable('iv', {
        i: getFetchingParamsFromColumnState(fromClosed.initialState()),
        v: {pagesLoaded: 1, totalPages: 1, totalElements: 2, filter: null},
      });
    }));

    it(`shouldn't fetch next page if all pages are loaded`, marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {
          results: exampleAssignments(),
          totalPages: 1,
          numberOfElements: 1,
          totalElements: 1,
        },
      }));
      loadDataForAllColumns();
      m.flush();
      loadDataForAllColumns();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_NEW')).toBeObservable('--a', {
        a: exampleAssignments(),
      });
      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('--a', {
        a: exampleAssignments(),
      });
      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('--a', {
        a: exampleAssignments(),
      });
      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_CLOSED')).toBeObservable('--a', {
        a: exampleAssignments(),
      });

      expect(assignmentsListServiceMock.loadNextPage).toHaveBeenCalledTimes(4);
    }));
  });

  describe('getAssignmentsTotal()', () => {
    it('should fetch total of new assignments', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {totalElements: 123, results: []},
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');

      m.expect(facadeService.getAssignmentsTotal('ASSIGNMENTS_BOARD_NEW')).toBeObservable('ea', {
        e: 0,
        a: 123,
      });
    }));

    it('should fetch total of ongoing assignments', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {totalElements: 123, results: []},
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_ONGOING');

      m.expect(facadeService.getAssignmentsTotal('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('ea', {
        e: 0,
        a: 123,
      });
    }));

    it('should fetch total of ready to plan assignments', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {totalElements: 123, results: []},
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_READY_TO_PLAN');

      m.expect(facadeService.getAssignmentsTotal('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('ea', {
        e: 0,
        a: 123,
      });
    }));

    it('should fetch total of closed assignments', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {totalElements: 123, results: []},
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_CLOSED');

      m.expect(facadeService.getAssignmentsTotal('ASSIGNMENTS_BOARD_CLOSED')).toBeObservable('ea', {
        e: 0,
        a: 123,
      });
    }));
  });

  describe('reset()', () => {
    it('should reset main state to initial value', marbles(m => {
      m.expect(store.select(selectMainState)).toBeObservable('(eae)', {
        e: fromMain.initialState(),
        a: {
          ...fromMain.initialState(),
          draggedAssignment: exampleAssignment(),
        },
      });

      store.dispatch(AssignmentsActions.startDragging({assignment: exampleAssignment()}));

      facadeService.reset();
    }));

    it('should reset new assignments state to initial value', marbles(m => {
      m.expect(store.select(selectNewAssignmentsState)).toBeObservable('(eae)', {
        e: fromNewAssignments.initialState(),
        a: {
          ids: ['1', '2'],
          entities: {1: exampleAssignment('1'), 2: exampleAssignment('2')},
          pagesLoaded: 1,
          totalPages: 1,
          totalElements: 2,
          filter: null,
          isLoading: false,
          updatedAssignment: null,
        },
      });

      store.dispatch(AssignmentsActions.loadNextPageSuccess({
        columnName: 'ASSIGNMENTS_BOARD_NEW',
        response: {
          results: exampleAssignments(),
          numberOfElements: 2,
          totalElements: 2,
          totalPages: 1,
        },
      }));

      facadeService.reset();
    }));

    it('should reset ready to plan state to initial value', marbles(m => {
      m.expect(store.select(selectReadyToPlanState)).toBeObservable('(eae)', {
        e: fromReadyToPlan.initialState(),
        a: {
          ids: ['1', '2'],
          entities: {1: exampleAssignment('1'), 2: exampleAssignment('2')},
          pagesLoaded: 1,
          totalPages: 1,
          totalElements: 2,
          filter: null,
          isLoading: false,
          updatedAssignment: null,
        },
      });

      store.dispatch(AssignmentsActions.loadNextPageSuccess({
        columnName: 'ASSIGNMENTS_BOARD_READY_TO_PLAN',
        response: {
          results: exampleAssignments(),
          numberOfElements: 2,
          totalElements: 2,
          totalPages: 1,
        },
      }));

      facadeService.reset();
    }));

    it('should reset ongoing state to initial value', marbles(m => {
      m.expect(store.select(selectOngoingState)).toBeObservable('(eae)', {
        e: fromOngoing.initialState(),
        a: {
          ids: ['1', '2'],
          entities: {1: exampleAssignment('1'), 2: exampleAssignment('2')},
          pagesLoaded: 1,
          totalPages: 1,
          totalElements: 2,
          filter: null,
          isLoading: false,
          updatedAssignment: null,
        },
      });

      store.dispatch(AssignmentsActions.loadNextPageSuccess({
        columnName: 'ASSIGNMENTS_BOARD_ONGOING',
        response: {
          results: exampleAssignments(),
          numberOfElements: 2,
          totalElements: 2,
          totalPages: 1,
        },
      }));

      facadeService.reset();
    }));
  });

  describe('hasFetchedAll', () => {
    it('should select true if all pages were fetched', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {
          results: exampleAssignments(),
          totalPages: 2,
          numberOfElements: 2,
          totalElements: 2,
        },
      }));

      m.expect(facadeService.getHasFetchedAll('ASSIGNMENTS_BOARD_NEW')).toBeObservable('ft', {
        f: false,
        t: true,
      });
      m.expect(facadeService.getHasFetchedAll('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('ft', {
        f: false,
        t: true,
      });
      m.expect(facadeService.getHasFetchedAll('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('ft', {
        f: false,
        t: true,
      });
      m.expect(facadeService.getHasFetchedAll('ASSIGNMENTS_BOARD_CLOSED')).toBeObservable('ft', {
        f: false,
        t: true,
      });

      loadDataForAllColumns();
      loadDataForAllColumns();
    }));
  });

  describe('reject()', () => {
    it('should update isUpdating state', marbles(m => {
      m.expect(facadeService.isUpdating).toBeObservable('(ftf)', {t: true, f: false});

      assignmentsListServiceMock.dispatch.withArgs(exampleAssignment(), 'reject').and.returnValue(m.cold('a|', {
        a: exampleAssignment('1'),
      }));
      facadeService.reject(exampleAssignment());
    }));

    it('should remove rejected assignment', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments()},
      }));

      assignmentsListServiceMock.dispatch.withArgs(exampleAssignment('1'), 'reject')
        .and.returnValue(m.cold('a|', {
        a: exampleAssignment('1'),
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');
      m.flush();
      facadeService.reject(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_NEW')).toBeObservable('---a', {
        a: [exampleAssignment('2')],
      });
    }));

    it('should restore original assignment when reject fails', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments()},
      }));

      assignmentsListServiceMock.dispatch.withArgs(exampleAssignment('1'), 'reject')
        .and.returnValue(throwError('some error'));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');
      m.flush();
      facadeService.reject(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_NEW')).toBeObservable('--a', {
        a: exampleAssignments(),
      });
    }));
  });

  describe('accept()', () => {
    it('should update isUpdating state', marbles(m => {
      m.expect(facadeService.isUpdating).toBeObservable('(ftf)', {t: true, f: false});

      assignmentsListServiceMock.dispatch.withArgs(exampleAssignment(), 'accept').and.returnValue(m.cold('a|', {
        a: exampleAssignment('1'),
      }));
      facadeService.accept(exampleAssignment());
    }));

    it('should remove assignment from new assignments', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments(), totalElements: 2},
      }));

      assignmentsListServiceMock.dispatch.withArgs(exampleAssignment('1'), 'accept').and.returnValue(m.cold('a|', {
        a: exampleAssignment('1'),
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');
      m.flush();
      facadeService.accept(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_NEW')).toBeObservable('---a', {
        a: [exampleAssignment('2')],
      });
      m.expect(facadeService.getAssignmentsTotal('ASSIGNMENTS_BOARD_NEW')).toBeObservable('---a', {
        a: 1,
      });
    }));

    it('should add updated assignment to ready to plan assignments', marbles(m => {
      const updatedAssignment = exampleAssignment('1', 'ACCEPTED', 'RELEASED');
      assignmentsListServiceMock.dispatch.withArgs(exampleAssignment('1'), 'accept')
        .and.returnValue(m.cold('a|', {
        a: updatedAssignment,
      }));

      facadeService.accept(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('-a', {
        a: [updatedAssignment],
      });
      m.expect(facadeService.getAssignmentsTotal('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('-a', {
        a: 1,
      });
    }));

    it('should restore original assignment when accept fails', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments()},
      }));

      assignmentsListServiceMock.dispatch.withArgs(exampleAssignment('1'), 'accept').and.returnValue(throwError('some error'));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');
      m.flush();
      facadeService.accept(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_NEW')).toBeObservable('--a', {
        a: exampleAssignments(),
      });
    }));
  });

  describe('release()', () => {
    it('should update isUpdating state', marbles(m => {
      m.expect(facadeService.isUpdating).toBeObservable('(ftf)', {t: true, f: false});

      assignmentsListServiceMock.dispatch.withArgs(exampleAssignment(), 'update').and.returnValue(m.cold('a|', {
        a: exampleAssignment('1'),
      }));

      assignmentsListServiceMock.dispatch.withArgs(exampleAssignment(), 'release').and.returnValue(m.cold('a|', {
        a: exampleAssignment('1'),
      }));

      facadeService.release(exampleAssignment());
    }));

    it('should remove released assignment from ready to plan states', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments(), totalElements: 2},
      }));

      assignmentsListServiceMock.dispatch
        .and.returnValue(m.cold('a|', {
        a: exampleAssignment('1'),
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_READY_TO_PLAN');
      m.flush();
      facadeService.release(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('---a', {
        a: [exampleAssignment('2')],
      });
      m.expect(facadeService.getAssignmentsTotal('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('---a', {
        a: 1,
      });
    }));

    it('should add updated assignment to ongoing assignments', marbles(m => {
      const updatedAssignment = exampleAssignment('1', 'ACCEPTED', 'RELEASED');
      assignmentsListServiceMock.dispatch
        .and.returnValue(m.cold('a|', {
        a: updatedAssignment,
      }));

      facadeService.release(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('-a', {
        a: [updatedAssignment],
      });
      m.expect(facadeService.getAssignmentsTotal('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('-a', {
        a: 1,
      });
    }));

    it('should restore original assignment when release fails', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments()},
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_READY_TO_PLAN');
      m.flush();
      facadeService.getAssignments('ASSIGNMENTS_BOARD_READY_TO_PLAN').subscribe(a => JSON.stringify(a, null, 2));

      assignmentsListServiceMock.dispatch.withArgs(exampleAssignment('1'), 'update')
        .and.returnValue(throwError('some error'));
      facadeService.release(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('--a', {
        a: exampleAssignments(),
      });
    }));
  });

  describe('handover()', () => {
    it('should update isUpdating state', marbles(m => {
      m.expect(facadeService.isUpdating).toBeObservable('(ftf)', {t: true, f: false});

      assignmentsListServiceMock.handover.withArgs(exampleAssignment()).and.returnValue(m.cold('a|', {
        a: exampleAssignment('1'),
      }));

      facadeService.handover(exampleAssignment());
    }));

    it('should add new assignment on success', marbles(m => {
      const updatedAssignment = (): Assignment => exampleAssignment('updated');
      assignmentsListServiceMock.handover.and.returnValue(m.cold('a|', {
        a: updatedAssignment(),
      }));

      m.flush();
      facadeService.handover(exampleAssignment());
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('-a', {
        a: [updatedAssignment()],
      });
    }));

    it('should restore original assignment when handover fails', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments()},
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_ONGOING');
      m.flush();
      facadeService.getAssignments('ASSIGNMENTS_BOARD_ONGOING').subscribe(a => JSON.stringify(a, null, 2));

      assignmentsListServiceMock.handover.withArgs(exampleAssignment('1'))
        .and.returnValue(throwError('some error'));
      facadeService.handover(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('--a', {
        a: exampleAssignments(),
      });
    }));
  });

  describe('close()', () => {
    it('should update isUpdating state', marbles(m => {
      m.expect(facadeService.isUpdating).toBeObservable('(ftf)', {t: true, f: false});

      assignmentsListServiceMock.dispatch.withArgs(exampleAssignment(), 'close').and.returnValue(m.cold('a|', {
        a: exampleAssignment('1'),
      }));
      facadeService.close(exampleAssignment());
    }));

    it('should remove closed assignment from ongoing state', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments(), totalElements: 2},
      }));

      assignmentsListServiceMock.dispatch
        .and.returnValue(m.cold('a|', {
        a: exampleAssignment('1'),
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_ONGOING');
      m.flush();
      facadeService.close(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('---a', {
        a: [exampleAssignment('2')],
      });
      m.expect(facadeService.getAssignmentsTotal('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('---a', {
        a: 1,
      });
    }));

    it('should add updated assignment to closed assignments', marbles(m => {
      const updatedAssignment = exampleAssignment('1', 'ACCEPTED', 'CLOSED');
      assignmentsListServiceMock.dispatch
        .and.returnValue(m.cold('a|', {
        a: updatedAssignment,
      }));

      facadeService.close(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_CLOSED')).toBeObservable('-a', {
        a: [updatedAssignment],
      });
      m.expect(facadeService.getAssignmentsTotal('ASSIGNMENTS_BOARD_CLOSED')).toBeObservable('-a', {
        a: 1,
      });
    }));

    it('should restore original assignment when close fails', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments()},
      }));

      assignmentsListServiceMock.dispatch.withArgs(exampleAssignment('1'), 'close')
        .and.returnValue(throwError('some error'));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_ONGOING');
      m.flush();
      facadeService.close(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('--a', {
        a: exampleAssignments(),
      });
    }));
  });

  describe('search()', () => {
    it('should clean up assignments', marbles(m => {
      const query = 'search query';

      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments()},
      }));

      loadDataForAllColumns();
      m.flush();
      facadeService.search(query);

      const assertEmptyAssignments = (column: ColumnName) =>
        m.expect(facadeService.getAssignments(column)).toBeObservable(
          '--ea',
          {e: [], a: exampleAssignments()},
        );

      assertEmptyAssignments('ASSIGNMENTS_BOARD_NEW');
      assertEmptyAssignments('ASSIGNMENTS_BOARD_READY_TO_PLAN');
      assertEmptyAssignments('ASSIGNMENTS_BOARD_ONGOING');
      assertEmptyAssignments('ASSIGNMENTS_BOARD_CLOSED');
    }));

    it('should clean up fetching params and set filter query', marbles(m => {
      const query = 'search query';

      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments(), totalElements: 1, totalPages: 2},
      }));

      loadDataForAllColumns();
      m.flush();
      facadeService.search(query);

      const assertEmptyFetchingParamsAssignments = (column: ColumnName) =>
        m.expect(facadeService.getFetchingParams(column)).toBeObservable(
          '--ea',
          {
            e: {
              ...emptyFetchingParams(),
              filter: {query},
            },
            a: {
              pagesLoaded: 1,
              totalElements: 1,
              totalPages: 2,
              filter: {query: 'search query'},
            } as any,
          },
        );

      assertEmptyFetchingParamsAssignments('ASSIGNMENTS_BOARD_NEW');
      assertEmptyFetchingParamsAssignments('ASSIGNMENTS_BOARD_READY_TO_PLAN');
      assertEmptyFetchingParamsAssignments('ASSIGNMENTS_BOARD_ONGOING');
      assertEmptyFetchingParamsAssignments('ASSIGNMENTS_BOARD_CLOSED');
    }));
  });

  describe('startDragging() and endDragging()', () => {
    it('should update dragged assignment state', marbles(m => {
      m.expect(facadeService.draggedAssignment).toBeObservable('(eae)', {e: null, a: exampleAssignment()});

      facadeService.startDragging(exampleAssignment());
      facadeService.endDragging();
    }));
  });

  describe('setFilter()', () => {
    it(`should update new assignments state filter`, marbles(m => {
      facadeService.setFilter('ASSIGNMENTS_BOARD_NEW', exampleFetchingFilter());
      m.expect(facadeService.getFetchingParams('ASSIGNMENTS_BOARD_NEW')).toBeObservable('v', {
        v: {pagesLoaded: 0, totalPages: 0, totalElements: 0, filter: exampleFetchingFilter()},
      });
    }));

    it(`should update ready to plan state filter`, marbles(m => {
      facadeService.setFilter('ASSIGNMENTS_BOARD_READY_TO_PLAN', exampleFetchingFilter());
      m.expect(facadeService.getFetchingParams('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('v', {
        v: {pagesLoaded: 0, totalPages: 0, totalElements: 0, filter: exampleFetchingFilter()},
      });
    }));
  });

  describe('wrong column name error handling', () => {
    it('should throw error in getAssignments()', () => {
      expect(() => facadeService.getAssignments('wrong column name' as any)).toThrow();
    });

    it('should throw error in getHasFetchedAll()', () => {
      expect(() => facadeService.getHasFetchedAll('wrong column name' as any)).toThrow();
    });

    it('should throw error in getFetchingParams()', () => {
      expect(() => facadeService.getFetchingParams('wrong column name' as any)).toThrow();
    });

    it('should throw error in getIsLoading()', () => {
      expect(() => facadeService.getIsLoading('wrong column name' as any)).toThrow();
    });
  });
});
