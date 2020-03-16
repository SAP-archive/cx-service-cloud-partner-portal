import { AuthFacade } from './auth.facade';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { authFeatureKey, initialState, State } from './auth.reducer';
import { Store } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { RecursivePartial } from '../../utils/recursive-partial';
import { exampleAuthData } from '../model/auth-data.model';
import * as AuthActions from './auth.actions';
import { exampleCredentials } from '../model/credentials.model';

describe('AuthFacade', () => {
  type MockedState = RecursivePartial<{ [authFeatureKey]: State }>;
  let store: MockStore<MockedState>;
  let facade: AuthFacade;

  const getState = (authState: RecursivePartial<State> = initialState): RecursivePartial<MockedState> => ({
    [authFeatureKey]: authState,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        provideMockStore({
          initialState: getState(),
        }),
      ],
    });

    store = TestBed.get(Store);
    facade = TestBed.get(AuthFacade);
  });

  describe('isBusy', () => {
    it('should select isBusy from state', () => {
      store.setState(getState({isBusy: true}));
      expect(facade.isBusy).toBeObservable(cold('a', {a: true}));

      store.setState(getState({isBusy: false}));
      expect(facade.isBusy).toBeObservable(cold('a', {a: false}));
    });
  });

  describe('isLoggedIn', () => {
    it('should select isLoggedIn from state', () => {
      store.setState(getState({authUserData: {authToken: null}}));
      expect(facade.isLoggedIn).toBeObservable(cold('a', {a: false}));

      store.setState(getState({authUserData: {authToken: 'token'}}));
      expect(facade.isLoggedIn).toBeObservable(cold('a', {a: true}));
    });
  });

  describe('authUserData', () => {
    it('should select authUserData from state', () => {
      store.setState(getState({authUserData: exampleAuthData()}));
      expect(facade.authUserData).toBeObservable(cold('a', {a: exampleAuthData()}));
    });
  });

  describe('redirectTo', () => {
    it('should select redirectTo from state', () => {
      const route = '/my-route';
      store.setState(getState({redirectTo: route}));
      expect(facade.redirectTo).toBeObservable(cold('a', {a: route}));
    });
  });

  describe('companyName', () => {
    it('should select companyName from state', () => {
      const companyName = '1';
      store.setState(getState({authUserData: {...exampleAuthData(), companyName}}));
      expect(facade.companyName).toBeObservable(cold('a', {a: companyName}));
    });
  });

  describe('login()', () => {
    it('should dispatch login action', () => {
      const spy = spyOn(store, 'dispatch');
      const loginAction = AuthActions.login({credentials: exampleCredentials()});

      facade.login(exampleCredentials());

      expect(spy).toHaveBeenCalledWith(loginAction);
    });
  });

  describe('setRedirectTo()', () => {
    it('should dispatch setRedirectTo action', () => {
      const route = '/my-route';
      const spy = spyOn(store, 'dispatch');
      const setRedirectToAction = AuthActions.setRedirectTo({route});

      facade.setRedirectTo(route);

      expect(spy).toHaveBeenCalledWith(setRedirectToAction);
    });
  });
});
