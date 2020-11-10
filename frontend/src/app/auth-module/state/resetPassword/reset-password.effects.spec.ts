import { exampleResetPasswordData } from '../../model/reset-password-data.model';
import { ResetPasswordEffects } from './reset-password.effects';
import { ResetPasswordFacade } from './reset-password.facade';
import { Observable, of } from 'rxjs';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { AuthService } from '../../../auth-module/services/auth.service';
import { Action } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import * as resetPasswordActions from './reset-password.actions';
import { cold, hot } from 'jasmine-marbles';
import * as AuthActions from '../auth/auth.actions';
import * as ReportingActions from '../../../state/reporting/reporting.actions';
import { Router } from '@angular/router';

describe('ResetPasswordEffects', () => {
  let actions$: Observable<Action>;
  let effects: ResetPasswordEffects;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let resetPasswordFacade: Partial<ResetPasswordFacade>;
  let metadata: EffectsMetadata<ResetPasswordEffects>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj([
      'getPartialEmailAddress',
      'sendVerificationCode',
      'verifyVerificationCode',
      'resetPassword'
    ]);
    routerMock = jasmine.createSpyObj(['navigate']);
    resetPasswordFacade = { data$: of(exampleResetPasswordData()) };

    TestBed.configureTestingModule({
      providers: [
        ResetPasswordEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: authServiceMock },
        { provide: ResetPasswordFacade, useValue: resetPasswordFacade },
        { provide: Router, useValue: routerMock },
      ],
    });

    effects = TestBed.inject<ResetPasswordEffects>(ResetPasswordEffects);
    metadata = getEffectsMetadata(effects);
  });

  describe('fetchPartialEmailAddress', () => {
    it('fetch Partial Email Address', () => {
      const maskedEmail = '***@sap.com';
      authServiceMock.getPartialEmailAddress.and.returnValue(of( { maskedEmail }));
      actions$ = hot('--a-', {a: resetPasswordActions.fetchPartialEmailAddress({
        accountName: 'my-account',
        userName: 'my-user'
      })});
      const expectedResult = cold('--b', {b: resetPasswordActions.fetchPartialEmailAddressSuccess({ maskedEmail })});
      expect(effects.fetchPartialEmailAddress$).toBeObservable(expectedResult);
    });
  });

  describe('handleError', () => {
    it('Report error when fetchPartialEmailAddressFail', () => {
      const mockError = {
        error: {
          code: 404,
          message: 'User wasn\'t found or has no email provided.'
        }
      };
      actions$ = hot('--a-', {a: resetPasswordActions.fetchPartialEmailAddressFail(mockError)});
      const expectedResult = cold('--b', {b: ReportingActions.reportError({message: mockError.error.message})});
      expect(effects.handleError$).toBeObservable(expectedResult);
    });
  });

  describe('sendVerificationCode', () => {
    it('send verification code', () => {
      const email = exampleResetPasswordData().email;
      authServiceMock.sendVerificationCode.and.returnValue(of(null));
      actions$ = hot('--a-', {a: resetPasswordActions.sendVerificationCode({
        email
      })});
      const expectedResult = cold('--b', {b: resetPasswordActions.sendVerificationCodeSuccess()});
      expect(effects.sendVerificationCode$).toBeObservable(expectedResult);
    });
  });

  describe('verifyVerificationCode', () => {
    it('verify verification code', () => {
      const verificationCode = exampleResetPasswordData().verificationCode;
      authServiceMock.verifyVerificationCode.and.returnValue(of(null));
      actions$ = hot('--a-', {a: resetPasswordActions.verifyVerificationCode({
        verificationCode
      })});
      const expectedResult = cold('--b', {b: resetPasswordActions.verifyVerificationCodeSuccess()});
      expect(effects.verifyVerificationCode$).toBeObservable(expectedResult);
    });
  });

  describe('resendVerificationCode', () => {
    it('resend verification code', () => {
      const email = exampleResetPasswordData().email;
      actions$ = hot('--a-', { a: resetPasswordActions.resendVerificationCode() });
      const expectedResult = cold('--b', { b: resetPasswordActions.sendVerificationCode({ email }) });
      expect(effects.resendVerificationCode$).toBeObservable(expectedResult);
    });
  });

  describe('resetPassword', () => {
    it('should dispatch resetPasswordSuccess and login with credentials', () => {
      const newPassword = 'newPwd';
      actions$ = hot('--a-', { a: resetPasswordActions.resetPassword({ newPassword }) });
      authServiceMock.resetPassword.and.returnValue(of(null));
      const expectedResult = cold('--(bc)', {
        b: resetPasswordActions.resetPasswordSuccess(),
        c: AuthActions.login({
          credentials: {
            accountName: exampleResetPasswordData().accountName,
            userName: exampleResetPasswordData().userName,
            password: newPassword,
          }
        })
      });
      expect(effects.resetPassword$).toBeObservable(expectedResult);
    });
  });
});
