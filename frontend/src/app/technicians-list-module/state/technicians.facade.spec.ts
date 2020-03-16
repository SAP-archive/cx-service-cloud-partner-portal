import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { TechniciansFacade } from './technicians.facade';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialState, State, techniciansFeatureKey } from './technicians.reducer';
import { RecursivePartial } from '../../utils/recursive-partial';
import { exampleTechnician } from '../models/technician.model';
import * as techniciansActions from './technicians.actions';

type MockedState = RecursivePartial<{ [techniciansFeatureKey]: State }>;

describe('TechniciansFacade', () => {
  let facadeService: TechniciansFacade;
  let store: MockStore<MockedState>;

  const getState = (state: RecursivePartial<State> = initialState): RecursivePartial<MockedState> => ({
    [techniciansFeatureKey]: state,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TechniciansFacade,
        provideMockStore<State>({
          initialState: {
            isLoading: false,
            technicians: null,
          },
        }),
      ],
    });

    facadeService = TestBed.get(TechniciansFacade);
    store = TestBed.get(Store);
  });

  describe('technicians', () => {
    it('emits list of technicians', () => {
      store.setState(getState({technicians: [exampleTechnician()] as any}));
      expect(facadeService.technicians).toBeObservable(cold('a', {a: [exampleTechnician()]}));
    });

    it('emits nothing if list of technicians is not defined', () => {
      store.setState(getState({technicians: null}));
      expect(facadeService.technicians).toBeObservable(cold('-'));
    });
  });
  describe('loadingTechnicians', () => {
    it('emits true if loading', () => {
      store.setState(getState({isLoading: true}));
      expect(facadeService.loadingTechnicians).toBeObservable(cold('a', {a: true}));
    });
    it('emits false if not loading', () => {
      store.setState(getState({isLoading: false}));
      expect(facadeService.loadingTechnicians).toBeObservable(cold('a', {a: false}));
    });
  });

  describe('loadTechnicians()', () => {
    it('emits dispatch loadTechnicians action', () => {
      spyOn(store, 'dispatch');
      facadeService.loadTechnicians();
      expect(store.dispatch).toHaveBeenCalledWith(techniciansActions.loadTechnicians());
    });
  });

  describe('deleteTechnician()', () => {
    it('emits dispatch deleteTechnician action', () => {
      spyOn(store, 'dispatch');
      facadeService.deleteTechnician(exampleTechnician());
      expect(store.dispatch).toHaveBeenCalledWith(techniciansActions.deleteTechnician({technician: exampleTechnician()}));
    });
  });
});
