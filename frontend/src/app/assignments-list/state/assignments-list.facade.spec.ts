import { TestBed } from '@angular/core/testing';
import { AssignmentsListFacade } from './assignments-list.facade';
import { Store, StoreModule } from '@ngrx/store';
import * as fromAssignments from './assignments-list.reducer';
import { initialState, State } from './assignments-list.reducer';
import { AssignmentsListService } from '../services/assignments-list.service';
import { EffectsModule } from '@ngrx/effects';
import { AssignmentsListEffects } from './assignments-list.effects';
import { marbles } from 'rxjs-marbles/jasmine';
import { Assignment, exampleAssignment, newAssignment, ongoingAssignment, readyToPlanAssignment } from '../model/assignment';
import { CrowdApiResponse } from '../../technicians-list-module/models/crowd-api-response.model';
import { selectAssignmentsState } from './assignments-list.selectors';
import * as AssignmentsActions from './assignments-list.actions';
import { accept, release } from './assignments-list.actions';
import { emptyFetchingParams } from '../model/fetching-params.model';
import { DispatchingStatus } from '../model/dispatching-status';
import { ServiceAssignmentState } from '../model/service-assignment-state';
import { exampleFetchingFilter } from '../model/fetching-filter';
import { throwError } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('AssignmentsFacade', () => {
  let facadeService: AssignmentsListFacade;
  let store: Store;
  let assignmentsListServiceMock: SpyObj<AssignmentsListService>;

  const exampleAssignments = (partnerDispatchingStatus: DispatchingStatus = 'NOTIFIED', serviceAssignmentState: ServiceAssignmentState = 'ASSIGNED') => [
    exampleAssignment('1', partnerDispatchingStatus, serviceAssignmentState),
    exampleAssignment('2', partnerDispatchingStatus, serviceAssignmentState),
  ];

  beforeEach(() => {
    assignmentsListServiceMock = jasmine.createSpyObj<AssignmentsListService>(['loadNextPage', 'reject', 'accept', 'update', 'release', 'close']);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(fromAssignments.assignmentsListFeatureKey, fromAssignments.reducer),
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
        m.expect(facadeService.getIsLoading('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('(ftf)', {t: true, f: false});
        m.expect(facadeService.getIsLoading('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('(ftf)', {t: true, f: false});
        m.expect(facadeService.getIsLoading('ASSIGNMENTS_BOARD_CLOSED')).toBeObservable('(ftf)', {t: true, f: false});

        assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('a|', {
          a: {results: exampleAssignments()},
        }));
        facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');
        facadeService.loadNextPage('ASSIGNMENTS_BOARD_READY_TO_PLAN');
        facadeService.loadNextPage('ASSIGNMENTS_BOARD_ONGOING');
        facadeService.loadNextPage('ASSIGNMENTS_BOARD_CLOSED');
      }));

      it(`when there's an error while loading next page`, marbles(m => {
        m.expect(facadeService.getIsLoading('ASSIGNMENTS_BOARD_NEW')).toBeObservable('(ftf)', {t: true, f: false});
        m.expect(facadeService.getIsLoading('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('(ftf)', {t: true, f: false});
        m.expect(facadeService.getIsLoading('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('(ftf)', {t: true, f: false});
        m.expect(facadeService.getIsLoading('ASSIGNMENTS_BOARD_CLOSED')).toBeObservable('(ftf)', {t: true, f: false});

        assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('#|'));
        facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');

        facadeService.loadNextPage('ASSIGNMENTS_BOARD_READY_TO_PLAN');
        facadeService.loadNextPage('ASSIGNMENTS_BOARD_ONGOING');
        facadeService.loadNextPage('ASSIGNMENTS_BOARD_CLOSED');
      }));
    });

    it('should set fetching params', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-v|', {
        v: {
          results: exampleAssignments(),
          numberOfElements: 2,
          totalElements: 2,
          totalPages: 1,
        } as CrowdApiResponse<Assignment>,
      }));
      facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');

      m.expect(facadeService.getFetchingParams('ASSIGNMENTS_BOARD_NEW')).toBeObservable('iv', {
        i: initialState().readyToPlanAssignments.fetchingParams,
        v: {pagesLoaded: 1, totalPages: 1, totalElements: 2},
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
      facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');
      m.flush();
      facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_NEW')).toBeObservable('--a', {
        a: exampleAssignments(),
      });

      expect(assignmentsListServiceMock.loadNextPage).toHaveBeenCalledTimes(1);
    }));
  });

  describe('reset()', () => {
    it('should reset state to initial value', marbles(m => {
      m.expect(store.select(selectAssignmentsState)).toBeObservable('(eae)', {
        e: initialState(),
        a: {
          isUpdating: false,
          originalAssignment: null,
          draggedAssignment: null,
          ids: ['1', '2'],
          entities: {1: exampleAssignment('1'), 2: exampleAssignment('2')},
          newAssignments: {
            fetchingParams: {
              pagesLoaded: 1,
              totalPages: 1,
              totalElements: 2,
            },
            isLoading: false,
          },
          readyToPlanAssignments: {
            fetchingParams: emptyFetchingParams(),
            isLoading: false,
          },
          ongoingAssignments: {
            fetchingParams: emptyFetchingParams(),
            isLoading: false,
          },
          closedAssignments: {
            fetchingParams: emptyFetchingParams(),
            isLoading: false,
          },
        } as State,
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

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');
      facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_READY_TO_PLAN');
      facadeService.loadNextPage('ASSIGNMENTS_BOARD_READY_TO_PLAN');

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_ONGOING');
      facadeService.loadNextPage('ASSIGNMENTS_BOARD_ONGOING');

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_CLOSED');
      facadeService.loadNextPage('ASSIGNMENTS_BOARD_CLOSED');
    }));
  });

  describe('reject()', () => {
    it('should update isUpdating state', marbles(m => {
      m.expect(facadeService.isUpdating).toBeObservable('(ftf)', {t: true, f: false});

      assignmentsListServiceMock.reject.and.returnValue(m.cold('a|', {
        a: {results: ['reject']},
      }));
      facadeService.reject(exampleAssignment());
    }));

    it('should remove reject assignment when reject success', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments()},
      }));

      assignmentsListServiceMock.reject.and.returnValue(m.cold('a|', {
        a: {results: ['reject']},
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

      assignmentsListServiceMock.reject.and.returnValue(throwError('some error'));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');
      m.flush();
      facadeService.reject(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_NEW')).toBeObservable('--a', {
        a: exampleAssignments().reverse(),
      });
    }));
  });

  describe('accept()', () => {
    it('should update isUpdating state', marbles(m => {
      m.expect(facadeService.isUpdating).toBeObservable('(ftf)', {t: true, f: false});

      assignmentsListServiceMock.accept.and.returnValue(m.cold('a|', {
        a: {results: ['accept']},
      }));
      facadeService.accept(exampleAssignment());
    }));

    it('should update assignment dispatchStatus when accept success', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments()},
      }));

      assignmentsListServiceMock.accept.and.returnValue(m.cold('a|', {
        a: {results: ['accept']},
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');
      m.flush();
      facadeService.accept(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_READY_TO_PLAN')).toBeObservable('---a', {
        a: [{...exampleAssignment('1'), partnerDispatchingStatus: 'ACCEPTED'}],
      });
    }));

    it('should restore original assignment when accept fails', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments()},
      }));

      assignmentsListServiceMock.accept.and.returnValue(throwError('some error'));

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

      assignmentsListServiceMock.update.and.returnValue(m.cold('a|', {
        a: {results: [exampleAssignment()]},
      }));

      assignmentsListServiceMock.release.and.returnValue(m.cold('a|', {
        a: {results: [exampleAssignment()]},
      }));
      facadeService.release(exampleAssignment());
    }));

    it('should update assignment when release is successful', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments()},
      }));

      assignmentsListServiceMock.release.and.returnValue(m.cold('a|', {
        a: {results: [exampleAssignment()]},
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');
      m.flush();
      const dateTime = new Date('2020/01/01 00:00:00');
      const updateAssignment: Assignment = {...exampleAssignment('1'), startDateTime: dateTime.toJSON(), serviceAssignmentState: 'RELEASED'};
      facadeService.release(updateAssignment);
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_NEW')).toBeObservable('--a', {
        a: [updateAssignment, exampleAssignment('2')],
      });
    }));

    it('should restore original assignment when update fails', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments()},
      }));

      assignmentsListServiceMock.update.and.returnValue(throwError('some error'));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_NEW');
      m.flush();
      const dateTime = new Date('2020/01/01 00:00:00');
      const updatedAssignment: Assignment = {...exampleAssignment('1'), startDateTime: dateTime.toJSON()};
      facadeService.release(updatedAssignment);
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_NEW')).toBeObservable('--a', {
        a: exampleAssignments(),
      });
    }));
  });

  describe('close()', () => {
    it('should update isUpdating state', marbles(m => {
      m.expect(facadeService.isUpdating).toBeObservable('(ftf)', {t: true, f: false});

      assignmentsListServiceMock.close.and.returnValue(m.cold('a|', {
        a: {results: [exampleAssignment()]},
      }));
      facadeService.close(exampleAssignment());
    }));

    it('should update assignment when close is successful', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments()},
      }));

      assignmentsListServiceMock.close.and.returnValue(m.cold('a|', {
        a: {results: [exampleAssignment()]},
      }));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_ONGOING');
      m.flush();
      facadeService.close(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_CLOSED')).toBeObservable('---a', {
        a: [{...exampleAssignment('1'), serviceAssignmentState: 'CLOSED'}],
      });
    }));

    it('should restore original assignment when close fails', marbles(m => {
      assignmentsListServiceMock.loadNextPage.and.returnValue(m.cold('-a|', {
        a: {results: exampleAssignments('ACCEPTED', 'RELEASED')},
      }));

      assignmentsListServiceMock.close.and.returnValue(throwError('some error'));

      facadeService.loadNextPage('ASSIGNMENTS_BOARD_ONGOING');
      m.flush();
      facadeService.close(exampleAssignment('1'));
      m.flush();

      m.expect(facadeService.getAssignments('ASSIGNMENTS_BOARD_ONGOING')).toBeObservable('--a', {
        a: exampleAssignments('ACCEPTED', 'RELEASED'),
      });
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
    it(`should update column's state with filter`, marbles(m => {
      facadeService.setFilter('ASSIGNMENTS_BOARD_NEW', exampleFetchingFilter());
      m.expect(facadeService.getFetchingParams('ASSIGNMENTS_BOARD_NEW')).toBeObservable('v', {
        v: {pagesLoaded: 0, totalPages: 0, totalElements: 0, filter: exampleFetchingFilter()},
      });
    }));
  });

  describe('advanceAssignment()', () => {
    it('should accept a new assignment', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      facadeService.advanceAssignment(newAssignment());
      expect(dispatchSpy).toHaveBeenCalledWith(accept({assignment: newAssignment()}));
    });

    it(`should release an assignment that's ready to plan`, () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      facadeService.advanceAssignment(readyToPlanAssignment());
      expect(dispatchSpy).toHaveBeenCalledWith(release({assignment: ongoingAssignment()}));
    });
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
