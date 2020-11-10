import { initialState, reducer } from './auth.reducer';
import * as AuthActions from './auth.actions';
import { AuthData, emptyAuthData, exampleAuthData } from '../../model/auth-data.model';
import { exampleLoginData, LoginData } from '../../model/login-data.model';
import { exampleCredentials } from '../../model/credentials.model';
import { exampleClientError } from '../../../model/client-error';

describe('Auth Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('on login action', () => {
    it('should set user credentials and isBusy to true', () => {
      const result = reducer(initialState, AuthActions.login({ credentials: exampleCredentials() }));

      expect(result.isBusy).toEqual(true);
      expect(result.authUserData).toEqual({
        ...emptyAuthData(),
        accountName: exampleCredentials().accountName,
        userName: exampleCredentials().userName,
        password: exampleCredentials().password,
      } as AuthData);
    });
  });

  describe('on loginSuccess action', () => {
    it('should set isBusy to false', () => {
      const result = reducer(
        { ...initialState, isBusy: true },
        AuthActions.loginSuccess({ loginData: exampleLoginData() }),
      );

      expect(result.isBusy).toEqual(false);
    });

    it('should set authUserData to data from action', () => {
      const loginData: LoginData = { ...exampleLoginData(), authData: exampleAuthData() };
      const result = reducer(initialState, AuthActions.loginSuccess({ loginData }));

      expect(result.authUserData).toEqual(exampleAuthData());
    });
  });

  describe('on loginFailure action', () => {
    it('should set isBusy to false and clear password', () => {
      const result = reducer(
        { ...initialState, isBusy: true, authUserData: { password: 'p4ssw0rd' } as any },
        AuthActions.loginFailure(),
      );

      expect(result.isBusy).toEqual(false);
      expect(result.authUserData.password).toBeNull();
    });
  });

  describe('on setRedirectTo action', () => {
    it('should set redirectTo to route url from action', () => {
      const route = '/my-route;id=1';
      const result = reducer(
        { ...initialState, isBusy: true },
        AuthActions.setRedirectTo({ route }),
      );

      expect(result.redirectTo).toEqual(route);
    });
  });

  describe('on passwordChangeNeeded action', () => {
    it('should set isBusy to false', () => {
      const result = reducer({ ...initialState, isBusy: true }, AuthActions.passwordChangeNeeded());

      expect(result.isBusy).toEqual(false);
    });
  });

  describe('on changePassword action', () => {
    it('should set isBusy to true', () => {
      const result = reducer({ ...initialState, isBusy: true }, AuthActions.changePassword({ newPassword: '' }));
      expect(result.isBusy).toEqual(true);
    });
  });

  describe('on changePasswordSuccess action', () => {
    it('should set isBusy to false', () => {
      const result = reducer({ ...initialState, isBusy: true }, AuthActions.changePasswordSuccess());
      expect(result.isBusy).toEqual(false);
    });
  });

  describe('on changePasswordFailure action', () => {
    it('should set isBusy to false', () => {
      const result = reducer({ ...initialState, isBusy: true }, AuthActions.changePasswordFailure({ error: exampleClientError() }));
      expect(result.isBusy).toEqual(false);
      expect(result.error).toEqual(exampleClientError());
    });
  });
});
