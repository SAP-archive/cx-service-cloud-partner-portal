import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { AuthService } from '../../services/auth.service';
import { cold, hot } from 'jasmine-marbles';
import * as AuthActions from './auth.actions';
import * as ReportingActions from '../../../state/reporting/reporting.actions';
import { Credentials, exampleCredentials } from '../../model/credentials.model';
import { exampleLoginData } from '../../model/login-data.model';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { AuthFacade } from './auth.facade';
import { exampleAuthData } from '../../model/auth-data.model';
import { HttpErrorResponse } from '@angular/common/http';
import { exampleClientError } from '../../../model/client-error';

describe('AuthEffects', () => {
  let actions$: Observable<Action>;
  let effects: AuthEffects;
  let metadata: EffectsMetadata<AuthEffects>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let authFacadeMock: Partial<AuthFacade>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj([
      'login',
      'redirectAfterLogin',
      'redirectToPasswordChangeRoute',
      'changePassword',
      'logout',
      'redirectAfterLogout',
    ]);
    authFacadeMock = { authUserData: of(exampleAuthData()) };

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: authServiceMock },
        { provide: AuthFacade, useValue: authFacadeMock },
      ],
    });

    effects = TestBed.inject<AuthEffects>(AuthEffects);
    metadata = getEffectsMetadata(effects);
  });

  describe('login', () => {
    describe('when password needs to be changed', () => {
      it('dispatch passwordChangeNeeded', () => {
        authServiceMock.login.withArgs(exampleCredentials()).and.returnValue(of({
          ...exampleLoginData(),
          passwordNeedsToBeChanged: true,
        }));
        actions$ = hot('--a-', { a: AuthActions.login({ credentials: exampleCredentials() }) });

        const expected = cold('--b', { b: AuthActions.passwordChangeNeeded() });

        expect(effects.login).toBeObservable(expected);
      });
    });

    describe('when logged in successfully', () => {
      it('dispatch loginSuccess', () => {
        authServiceMock.login.withArgs(exampleCredentials()).and.returnValue(of(exampleLoginData()));
        actions$ = hot('--a-', { a: AuthActions.login({ credentials: exampleCredentials() }) });

        const expected = cold('--b', {
          b: AuthActions.loginSuccess({ loginData: exampleLoginData() }),
        });

        expect(effects.login).toBeObservable(expected);
      });
    });

    it('should report error', () => {
      const message = 'error message';
      authServiceMock.login.and.returnValue(throwError(new HttpErrorResponse({ error: { error: message } })));
      actions$ = hot('--a-', { a: AuthActions.login({ credentials: exampleCredentials() }) });

      const expected = cold('--(bc)', {
        b: AuthActions.loginFailure(),
        c: ReportingActions.reportError({ message }),
      });

      expect(effects.login).toBeObservable(expected);
    });
  });

  describe('changePassword', () => {
    it('dispatch changePasswordSuccess', () => {
      const newPassword = 'h4x0r';
      const credentials: Credentials = {
        accountName: exampleAuthData().accountName,
        userName: exampleAuthData().userName,
        password: newPassword,
      };
      authServiceMock.changePassword.withArgs(newPassword).and.returnValue(of(undefined));
      actions$ = hot('--a-', { a: AuthActions.changePassword({ newPassword }) });

      const expected = cold('--(bc)', {
        b: AuthActions.changePasswordSuccess(),
        c: AuthActions.login({ credentials }),
      });

      expect(effects.changePassword).toBeObservable(expected);
    });

    it('should report error', () => {
      authServiceMock.changePassword.and.returnValue(throwError(new HttpErrorResponse({ error: exampleClientError() })));
      actions$ = hot('--a-', { a: AuthActions.changePassword({ newPassword: 'new password' }) });

      const expected = cold('--(bc)', {
        b: AuthActions.changePasswordFailure({ error: exampleClientError() }),
        c: ReportingActions.reportError({ message: exampleClientError().message }),
      });

      expect(effects.changePassword).toBeObservable(expected);
    });
  });

  describe('logout', () => {
    it('should logout and dispatch logoutSuccess', () => {
      authServiceMock.logout.and.returnValue(of(undefined));
      actions$ = hot('--a-', { a: AuthActions.logout() });

      const expected = cold('--b', { b: AuthActions.logoutSuccess() });

      expect(effects.logout).toBeObservable(expected);
    });

    it('should report error', () => {
      const message = 'error message';
      authServiceMock.logout.and.returnValue(throwError(new HttpErrorResponse({ error: { error: message } })));
      actions$ = hot('--a-', { a: AuthActions.logout() });

      const expected = cold('--(bc)', {
        b: AuthActions.logoutFailure(),
        c: ReportingActions.reportError({ message }),
      });

      expect(effects.logout).toBeObservable(expected);
    });
  });

  describe('redirectAfterLogin', () => {
    it('should redirect and not dispatch any action', () => {
      const action = () => AuthActions.loginSuccess({ loginData: exampleLoginData() });
      actions$ = hot('--a-', { a: action() });

      expect(effects.redirectAfterLogin).toBeObservable(cold('--b', { b: action() }));
      expect(metadata.redirectAfterLogin.dispatch).toBe(false);
      expect(authServiceMock.redirectAfterLogin).toHaveBeenCalled();
    });
  });

  describe('redirectToPasswordChangeRoute', () => {
    it('should redirect to password change route and not dispatch any action', () => {
      const action = () => AuthActions.passwordChangeNeeded();
      actions$ = hot('--a-', { a: action() });

      expect(effects.redirectToPasswordChangeRoute).toBeObservable(cold('--b', { b: action() }));
      expect(metadata.redirectToPasswordChangeRoute.dispatch).toBe(false);
      expect(authServiceMock.redirectToPasswordChangeRoute).toHaveBeenCalled();
    });
  });

  describe('redirectAfterLogout', () => {
    it('should redirect and not dispatch any action', () => {
      const action = () => AuthActions.logoutSuccess();
      actions$ = hot('--a-', { a: action() });

      expect(effects.redirectAfterLogout).toBeObservable(cold('--b', { b: action() }));
      expect(metadata.redirectAfterLogout.dispatch).toBe(false);
      expect(authServiceMock.redirectAfterLogout).toHaveBeenCalled();
    });
  });
});
