import { AssignmentsBoardColumnComponent } from './assignments-board-column.component';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AssignmentsListFacade } from '../../state/assignments-list.facade';
import { AssignmentsListFacadeMockBuilder } from '../../state/assignments-list.facade.mock.spec';
import { exampleFetchingParams } from '../../model/fetching-params.model';
import { marbles } from 'rxjs-marbles';
import { of } from 'rxjs';
import { Assignment, exampleAssignment, newAssignment } from '../../model/assignment';
import { CdkDrag, CdkDragDrop, CdkDragStart } from '@angular/cdk/drag-drop';
import { DeviceDetectorService } from 'ngx-device-detector';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('AssignmentsBoardColumnComponent', () => {
  let component: AssignmentsBoardColumnComponent;
  let facade: SpyObj<AssignmentsListFacade>;
  let viewport: SpyObj<CdkVirtualScrollViewport>;
  let deviceDetectorServiceMock: SpyObj<DeviceDetectorService>;

  const setupTestBed = (draggedAssignment: any = of(null)) => {
    facade = new AssignmentsListFacadeMockBuilder()
      .setDraggedAssignment(draggedAssignment)
      .build();
    deviceDetectorServiceMock = createSpyObj(['isDesktop']);
    component = new AssignmentsBoardColumnComponent(facade, deviceDetectorServiceMock);
    component.columnName = 'ASSIGNMENTS_BOARD_NEW';
    component.viewport = viewport = jasmine.createSpyObj(['getRenderedRange', 'getDataLength']);
    viewport.getRenderedRange.and.returnValue({start: 0, end: 1});
    viewport.getDataLength.and.returnValue(5);
    facade.getHasFetchedAll.withArgs('ASSIGNMENTS_BOARD_NEW').and.returnValue(of(true));
  };

  beforeEach((() => setupTestBed()));

  describe('ngOnInit()', () => {
    it('should set the fetching filter', () => {
      component.fetchingFilter = exampleFetchingParams().filter;
      component.ngOnInit();
      expect(facade.setFilter).toHaveBeenCalledWith('ASSIGNMENTS_BOARD_NEW', exampleFetchingParams().filter);
    });

    it('should share assignments from facade', marbles(m => {
      facade.getAssignments.withArgs(component.columnName).and.returnValue(m.cold('a', {a: [exampleAssignment()]}));
      component.ngOnInit();
      m.expect(component.assignments).toBeObservable('a', {a: [exampleAssignment()]});
    }));

    it('should share isLoading info from facade', marbles((m) => {
      facade.getIsLoading.withArgs(component.columnName).and.returnValue(m.cold('tft', {t: true, f: false}));
      component.ngOnInit();
      m.expect(component.isLoading).toBeObservable('tft', {t: true, f: false});
    }));

    describe('dragTimeout', () => {
      describe('if device is desktop', () => {
        it('should be set to zero', () => {
          deviceDetectorServiceMock.isDesktop.and.returnValue(true);
          component.ngOnInit();
          expect(component.dragTimeout).toEqual(0);
        });
      });

      describe('if device is not desktop', () => {
        it('should be set to 100', () => {
          deviceDetectorServiceMock.isDesktop.and.returnValue(false);
          component.ngOnInit();
          expect(component.dragTimeout).toEqual(100);
        });
      });
    });

    describe('isOriginalColumnOfDraggedAssignment', () => {
      describe('should emit true only if the column is the original one of the assignment', () => {
        it('for ASSIGNMENTS_BOARD_NEW column', marbles((m) => {
          const draggedAssignments = m.cold(
            'ema', {
              e: null,
              m: exampleAssignment('1'),
              a: exampleAssignment('1', 'ACCEPTED'),
            });
          setupTestBed(draggedAssignments);
          component.columnName = 'ASSIGNMENTS_BOARD_NEW';
          component.ngOnInit();

          m.expect(component.isOriginalColumnOfDraggedAssignment).toBeObservable('-tf', {t: true, f: false});
        }));

        it('for ASSIGNMENTS_BOARD_READY_TO_PLAN column', marbles((m) => {
          const draggedAssignments = m.cold(
            'ema', {
              e: null,
              m: exampleAssignment('1', 'ACCEPTED', 'ASSIGNED'),
              a: exampleAssignment(),
            });
          setupTestBed(draggedAssignments);
          component.columnName = 'ASSIGNMENTS_BOARD_READY_TO_PLAN';
          component.ngOnInit();

          m.expect(component.isOriginalColumnOfDraggedAssignment).toBeObservable('-tf', {t: true, f: false});
        }));

        it('for ASSIGNMENTS_BOARD_ONGOING column', marbles((m) => {
          const draggedAssignments = m.cold(
            'ema', {
              e: null,
              m: exampleAssignment('1', 'ACCEPTED', 'RELEASED'),
              a: exampleAssignment(),
            });
          setupTestBed(draggedAssignments);
          component.columnName = 'ASSIGNMENTS_BOARD_ONGOING';
          component.ngOnInit();

          m.expect(component.isOriginalColumnOfDraggedAssignment).toBeObservable('-tf', {t: true, f: false});
        }));

        it('for ASSIGNMENTS_BOARD_CLOSED column', marbles((m) => {
          const draggedAssignments = m.cold(
            'ema', {
              e: null,
              m: exampleAssignment('1', 'ACCEPTED', 'CLOSED'),
              a: exampleAssignment(),
            });
          setupTestBed(draggedAssignments);
          component.columnName = 'ASSIGNMENTS_BOARD_CLOSED';
          component.ngOnInit();

          m.expect(component.isOriginalColumnOfDraggedAssignment).toBeObservable('-tf', {t: true, f: false});
        }));
      });
    });

    describe('canReceiveDraggedAssignment', () => {
      it('should emit true only if assignment can be dropped on ASSIGNMENTS_BOARD_NEW column', marbles((m) => {
        const draggedAssignments = m.cold(
          'ema', {
            e: null,
            m: exampleAssignment('1'),
            a: exampleAssignment('1', 'ACCEPTED'),
          });
        setupTestBed(draggedAssignments);
        component.columnName = 'ASSIGNMENTS_BOARD_NEW';
        component.ngOnInit();

        m.expect(component.canReceiveDraggedAssignment).toBeObservable('-ff', {f: false});
      }));

      it('should emit true only if assignment can be dropped on ASSIGNMENTS_BOARD_READY_TO_PLAN column', marbles((m) => {
        const draggedAssignments = m.cold(
          'eyn', {
            e: null,
            y: exampleAssignment('1', 'NOTIFIED'),
            n: exampleAssignment('1', 'ACCEPTED'),
          });
        setupTestBed(draggedAssignments);
        component.columnName = 'ASSIGNMENTS_BOARD_READY_TO_PLAN';
        component.ngOnInit();

        m.expect(component.canReceiveDraggedAssignment).toBeObservable('-tf', {t: true, f: false});
      }));

      it('should emit true only if assignment can be dropped on ASSIGNMENTS_BOARD_ONGOING column', marbles((m) => {
        const draggedAssignments = m.cold(
          'eyn', {
            e: null,
            y: exampleAssignment('1', 'ACCEPTED', 'ASSIGNED'),
            n: exampleAssignment('1', 'ACCEPTED', 'RELEASED'),
          });
        setupTestBed(draggedAssignments);
        component.columnName = 'ASSIGNMENTS_BOARD_ONGOING';
        component.ngOnInit();

        m.expect(component.canReceiveDraggedAssignment).toBeObservable('-tf', {t: true, f: false});
      }));

      it('should emit true only if assignment can be dropped on ASSIGNMENTS_BOARD_CLOSED column', marbles((m) => {
        const draggedAssignments = m.cold(
          'eyn', {
            e: null,
            y: exampleAssignment('1', 'ACCEPTED', 'RELEASED'),
            n: exampleAssignment('1', 'ACCEPTED', 'ASSIGNED'),
          });
        setupTestBed(draggedAssignments);
        component.columnName = 'ASSIGNMENTS_BOARD_CLOSED';
        component.ngOnInit();

        m.expect(component.canReceiveDraggedAssignment).toBeObservable('-tf', {t: true, f: false});
      }));
    });
  });

  describe('scrolledIndexChange()', () => {
    describe('if reached end of viewport', () => {
      beforeEach(() => {
        viewport.getRenderedRange.and.returnValue({start: 0, end: 5});
      });

      describe('if all assignments have been fetched', () => {
        it(`shouldn't load next page of assignments`, () => {
          facade.getHasFetchedAll.withArgs('ASSIGNMENTS_BOARD_NEW').and.returnValue(of(true));
          facade.getIsLoading.withArgs('ASSIGNMENTS_BOARD_NEW').and.returnValue(of(false));
          component.scrolledIndexChange();
          expect(facade.loadNextPage).not.toHaveBeenCalled();
        });
      });

      describe('if not all assignments have been fetched', () => {
        describe('and is not currently loading assignments', () => {
          it('should load next page of assignments', () => {
            facade.getHasFetchedAll.withArgs('ASSIGNMENTS_BOARD_NEW').and.returnValue(of(false));
            facade.getIsLoading.withArgs('ASSIGNMENTS_BOARD_NEW').and.returnValue(of(false));
            component.scrolledIndexChange();
            expect(facade.loadNextPage).toHaveBeenCalledWith(component.columnName);
          });
        });

        describe('and is currently loading assignments', () => {
          it(`shouldn't load next page of assignments`, () => {
            facade.getIsLoading.withArgs('ASSIGNMENTS_BOARD_NEW').and.returnValue(of(true));
            component.scrolledIndexChange();
            expect(facade.loadNextPage).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe(`if hasn't reached end of viewport`, () => {
      beforeEach(() => {
        viewport.getRenderedRange.and.returnValue({start: 0, end: 1});
        viewport.getDataLength.and.returnValue(5);

        facade.getHasFetchedAll.withArgs('ASSIGNMENTS_BOARD_NEW').and.returnValue(of(false));
        facade.getIsLoading.withArgs('ASSIGNMENTS_BOARD_NEW').and.returnValue(of(false));
      });

      it(`shouldn't load next page of assignments`, () => {
        component.scrolledIndexChange();
        expect(facade.loadNextPage).not.toHaveBeenCalled();
      });
    });
  });

  describe('enterPredicate()', () => {
    it('should return true only if assignment can be dropped on ASSIGNMENTS_BOARD_NEW column', () => {
      component.columnName = 'ASSIGNMENTS_BOARD_NEW';

      expect(component.enterPredicate({data: exampleAssignment('1')} as CdkDrag<Assignment>)).toBeFalse();
      expect(component.enterPredicate({data: exampleAssignment('1', 'ACCEPTED')} as CdkDrag<Assignment>)).toBeFalse();
    });

    it('should return true only if assignment can be dropped on ASSIGNMENTS_BOARD_READY_TO_PLAN column', () => {
      component.columnName = 'ASSIGNMENTS_BOARD_READY_TO_PLAN';

      expect(component.enterPredicate({data: exampleAssignment('1', 'NOTIFIED')} as CdkDrag<Assignment>)).toBeTrue();
      expect(component.enterPredicate({data: exampleAssignment('1', 'ACCEPTED')} as CdkDrag<Assignment>)).toBeFalse();
    });

    it('should return true only if assignment can be dropped on ASSIGNMENTS_BOARD_ONGOING column', () => {
      component.columnName = 'ASSIGNMENTS_BOARD_ONGOING';

      expect(component.enterPredicate({data: exampleAssignment('1', 'ACCEPTED', 'ASSIGNED')} as CdkDrag<Assignment>)).toBeTrue();
      expect(component.enterPredicate({data: exampleAssignment('1', 'ACCEPTED', 'RELEASED')} as CdkDrag<Assignment>)).toBeFalse();
    });

    it('should return true only if assignment can be dropped on ASSIGNMENTS_BOARD_CLOSED column', () => {
      component.columnName = 'ASSIGNMENTS_BOARD_CLOSED';

      expect(component.enterPredicate({data: exampleAssignment('1', 'ACCEPTED', 'RELEASED')} as CdkDrag<Assignment>)).toBeTrue();
      expect(component.enterPredicate({data: exampleAssignment('1', 'ACCEPTED', 'ASSIGNED')} as CdkDrag<Assignment>)).toBeFalse();
    });
  });

  describe('onDragStart()', () => {
    it('should use facade to start dragging', () => {
      component.onDragStart({source: {data: exampleAssignment()}} as CdkDragStart);
      expect(facade.startDragging).toHaveBeenCalledWith(exampleAssignment());
    });
  });

  describe('onDragEnd()', () => {
    it('should use facade to start dragging', () => {
      component.onDragEnd();
      expect(facade.endDragging).toHaveBeenCalled();
    });
  });

  describe('onDrop()', () => {
    describe('if assignment is receivable', () => {
      it('should advance the assignment ', () => {
        component.columnName = 'ASSIGNMENTS_BOARD_READY_TO_PLAN';
        component.onDrop({item: {data: newAssignment()}} as CdkDragDrop<Assignment[]>);
        expect(facade.advanceAssignment).toHaveBeenCalledWith(newAssignment());
      });
    });

    describe(`if assignment isn't receivable`, () => {
      it('should not advance the assignment ', () => {
        component.columnName = 'ASSIGNMENTS_BOARD_NEW';
        component.onDrop({item: {data: newAssignment()}} as CdkDragDrop<Assignment[]>);
        expect(facade.advanceAssignment).not.toHaveBeenCalled();
      });
    });
  });
});
