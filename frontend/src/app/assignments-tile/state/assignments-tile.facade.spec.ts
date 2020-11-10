import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import * as fromAssignmentsTile from './assignments-tile.reducer';
import { AssignmentsTileService } from '../services/assignments-tile.service';
import { EffectsModule } from '@ngrx/effects';
import { AssignmentsTileEffects } from './assignments-tile.effects';
import { marbles } from 'rxjs-marbles/jasmine';
import { AssignmentsTileFacade } from './assignments-tile.facade';
import { emptyAssignmentsStats, exampleAssignmentsStats } from '../model/assignments-stats';
import SpyObj = jasmine.SpyObj;

describe('AssignmentsTileFacade', () => {
  let facadeService: AssignmentsTileFacade;
  let store: Store;
  let assignmentsTileServiceMock: SpyObj<AssignmentsTileService>;

  beforeEach(() => {
    assignmentsTileServiceMock = jasmine.createSpyObj<AssignmentsTileService>(['loadAssignmentsStats']);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(fromAssignmentsTile.assignmentsTileFeatureKey, fromAssignmentsTile.reducer),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([AssignmentsTileEffects]),
      ],
      providers: [
        AssignmentsTileFacade,
        {
          provide: AssignmentsTileService,
          useValue: assignmentsTileServiceMock,
        },
      ],
    });

    facadeService = TestBed.inject(AssignmentsTileFacade);
    store = TestBed.inject(Store);
  });

  describe('loadAssignmentsStats()', () => {
    it('should populate state with fetched assignments stats', marbles(m => {
      assignmentsTileServiceMock.loadAssignmentsStats.and.returnValue(m.cold('-a|', {
        a: exampleAssignmentsStats(),
      }));

      facadeService.loadAssignmentsStats();

      m.expect(facadeService.assignmentsStats).toBeObservable('ea', {
        e: emptyAssignmentsStats(),
        a: exampleAssignmentsStats(),
      });
    }));

    describe('isLoading should be set to true and then back to false', () => {
      it('when next page loads correctly', marbles(m => {
        m.expect(facadeService.isLoading).toBeObservable('(ftf)', {t: true, f: false});

        assignmentsTileServiceMock.loadAssignmentsStats.and.returnValue(m.cold('a|', {
          a: exampleAssignmentsStats(),
        }));
        facadeService.loadAssignmentsStats();
      }));

      it(`when there's an error while loading next page`, marbles(m => {
        m.expect(facadeService.isLoading).toBeObservable('(ftf)', {t: true, f: false});

        assignmentsTileServiceMock.loadAssignmentsStats.and.returnValue(m.cold('#|'));
        facadeService.loadAssignmentsStats();
      }));
    });
  });
});
