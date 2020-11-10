import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { RecursivePartial } from '../../utils/recursive-partial';
import { userDefaultState, UserState } from './user.reducer';
import { UserFacade } from './user.facade';
import * as UserAction from './user.actions';
import { exampleLocalisation } from '../../components/localisation-selector/localisation';

describe('UserFacade', () => {
  type MockedState = RecursivePartial<{ user: UserState }>;
  let store: MockStore<MockedState>;
  let facade: UserFacade;

  const getState = (userState: RecursivePartial<UserState> = userDefaultState): RecursivePartial<MockedState> => ({
    user: userState,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserFacade,
        provideMockStore({
          initialState: getState(),
        }),
      ],
    });

    store = TestBed.inject(Store) as MockStore<MockedState>;
    facade = TestBed.inject(UserFacade);
  });

  describe('currentLocalisation', () => {
    it('should select current localisation', () => {
      expect(facade.currentLocalisation).toBeObservable(cold('a', {a: userDefaultState.localisation}));
    });
  });

  describe('isLocalisationChangeNeeded', () => {
    it('should select isLocalisationChangeNeeded from state', () => {
      expect(facade.isLocalisationChangeNeeded).toBeObservable(cold('a', {a: userDefaultState.isLocalisationChangeNeeded}));
    });
  });

  describe('setIsLocalisationChangeNeeded()', () => {
    it('emits dispatch hasLocalisationBeenChangedBeforeLogin action', () => {
      spyOn(store, 'dispatch');
      facade.setIsLocalisationChangeNeeded(true);
      expect(store.dispatch).toHaveBeenCalledWith(UserAction.hasLocalisationBeenChangedBeforeLogin({
        isLocalisationChangeNeeded: true
      }));
    });
  });

  describe('setCurrentLocalisation()', () => {
    it('emits dispatch setCurrentLocalisation action', () => {
      spyOn(store, 'dispatch');
      const newLocalisation = exampleLocalisation();
      facade.setCurrentLocalisation(newLocalisation);
      expect(store.dispatch).toHaveBeenCalledWith(UserAction.setCurrentLocalisation({
        localisation: newLocalisation
      }));
    });
  });

});
