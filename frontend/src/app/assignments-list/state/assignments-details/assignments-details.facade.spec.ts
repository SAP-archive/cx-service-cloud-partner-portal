import { TestBed } from '@angular/core/testing';
import { AssignmentsDetailsFacade } from './assignments-details.facade';
import { Store, StoreModule } from '@ngrx/store';
import { initialState, State } from './assignments-details.reducer';
import { TechniciansListService } from '../../services/technicians-list.service';
import { EffectsModule } from '@ngrx/effects';
import { AssignmentsDetailsEffects } from './assignments-details.effects';
import { marbles } from 'rxjs-marbles/jasmine';
import { exampleAssignment } from '../../model/assignment';
import { exampleTechnician } from '../../../technicians-list-module/models/technician.model';
import { selectAssignmentsDetailsState } from './assignments-details.selectors';
import * as AssignmentsActions from './assignments-details.actions';
import * as fromAssignmentsDetails from './assignments-details.reducer';

describe('AssignmentsDetailsFacade', () => {
    let facadeService: AssignmentsDetailsFacade;
    let store: Store;
    let techniciansListServiceMock: jasmine.SpyObj<TechniciansListService>;

    const exampleTechnicians = () => [
        exampleTechnician('1'),
        exampleTechnician('2'),
    ];

    beforeEach(() => {
        techniciansListServiceMock = jasmine.createSpyObj<TechniciansListService>(['loadTechnicians']);

        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({}),
                StoreModule.forFeature(fromAssignmentsDetails.assignmentsDetailsFeatureKey, fromAssignmentsDetails.reducer),
                EffectsModule.forRoot([]),
                EffectsModule.forFeature([AssignmentsDetailsEffects]),
            ],
            providers: [
                AssignmentsDetailsFacade,
                {
                    provide: TechniciansListService,
                    useValue: techniciansListServiceMock,
                },
            ],
        });

        facadeService = TestBed.inject(AssignmentsDetailsFacade);
        store = TestBed.inject(Store);
    });

    describe('loadTechnicians()', () => {
        it('should update technicians with fetched technicians', marbles(m => {
            techniciansListServiceMock.loadTechnicians.and.returnValue(m.cold('-a|', {
                a: exampleTechnicians(),
            }));

            facadeService.loadTechnicians();

            m.expect(facadeService.technicians$).toBeObservable('ea', {
                e: [],
                a: exampleTechnicians(),
            });
        }));
    });

    describe('setCurrentAssignment()', () => {
        it('should update currentTechnician', marbles(m => {
            facadeService.setCurrentAssignment(exampleAssignment());

            m.expect(facadeService.currentAssignment$).toBeObservable('a', {
                a: exampleAssignment(),
            });
        }));
    });

    describe('setDisplayMode()', () => {
        it('should update displayMode', marbles(m => {
            facadeService.setDisplayMode('mobile');

            m.expect(facadeService.displayMode$).toBeObservable('a', {
                a: 'mobile',
            });
        }));
    });

    describe('reset()', () => {
        it('should reset state to initial value', marbles(m => {
            m.expect(store.select(selectAssignmentsDetailsState)).toBeObservable('(eae)', {
                e: initialState(),
                a: {
                    ids: ['1', '2'],
                    entities: { 1: exampleTechnician('1'), 2: exampleTechnician('2') },
                    isLoading: initialState().isLoading,
                    displayMode: initialState().displayMode,
                    currentAssignment: initialState().currentAssignment,
                } as State,
            });

            store.dispatch(AssignmentsActions.loadTechniciansSuccess({
                technicians: exampleTechnicians(),
            }));

            facadeService.reset();
        }));
    });
});
