import { initialState, reducer } from './reset-password.reducer';
import * as ResetPasswordActions from './reset-password.actions';
import {
  exampleResetPasswordData,
  emptyResetPasswordData,
  ResetPasswordData
} from '../../model/reset-password-data.model';

describe('ResetPassword Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const result = reducer(initialState, {} as any);
      expect(result).toBe(initialState);
    });
  });

  describe('resetPasswordActions.setData', () => {
    it('should set reset password data', () => {
      const result = reducer(initialState, ResetPasswordActions.setData({ data: exampleResetPasswordData() }));
      expect(result.data).toEqual(exampleResetPasswordData());
    });
  });

  describe('resetPasswordActions.fetchPartialEmailAddress', () => {
    it('should set reset password data', () => {
      const result = reducer(initialState,
        ResetPasswordActions.fetchPartialEmailAddress({
          accountName: 'my-account',
          userName: 'my-user'
        }));
      expect(result.isBusy).toEqual(true);
      expect(result.data).toEqual({
        ...emptyResetPasswordData(),
        accountName: 'my-account',
        userName: 'my-user'
      } as ResetPasswordData);
    });
  });

  describe('resetPasswordActions.fetchPartialEmailAddressSuccess', () => {
    it('should set masked email', () => {
      const maskedEmail: string = '***@sap.com';
      const result = reducer(initialState,
        ResetPasswordActions.fetchPartialEmailAddressSuccess({
          maskedEmail
        }));
      expect(result.data.maskedEmail).toEqual(maskedEmail);
      expect(result.isBusy).toEqual(false);
    });
  });

  describe('resetPasswordActions.fetchPartialEmailAddressFail', () => {
    it('should set error when fetch pArtial email sddress fail', () => {
      const error = {
        code: 500,
        message: 'error message',
        cloudError: null
      };
      const result = reducer(initialState,
        ResetPasswordActions.fetchPartialEmailAddressFail({
          error
        }));
      expect(result.error).toEqual(error);
      expect(result.isBusy).toEqual(false);
    });
  });

  describe('resetPasswordActions.sendVerificationCode', () => {
    it('should send verification code', () => {
      const email: string = 'test@sap.com';
      const result = reducer(initialState,
        ResetPasswordActions.sendVerificationCode({
          email
        }));
      expect(result.data.email).toEqual(email);
      expect(result.isBusy).toEqual(true);
      expect(result.error).toEqual(null);
    });
  });

  describe('resetPasswordActions.sendVerificationCodeSuccess', () => {
    it('should send verification code success', () => {
      const result = reducer(initialState,
        ResetPasswordActions.sendVerificationCodeSuccess());
      expect(result.isBusy).toEqual(false);
      expect(result.error).toEqual(null);
    });
  });

  describe('resetPasswordActions.sendVerificationCodeFailure', () => {
    it('should set error', () => {
      const error = {
        code: 500,
        message: 'error message',
        cloudError: null
      };
      const result = reducer(initialState,
        ResetPasswordActions.sendVerificationCodeFailure({
          error
        }));
      expect(result.error).toEqual(error);
      expect(result.isBusy).toEqual(false);
    });
  });

  describe('resetPasswordActions.resetData', () => {
    it('should initialize data', () => {
      const result = reducer(initialState,
        ResetPasswordActions.resetData());
      expect(result).toEqual(initialState);
    });
  });

  describe('resetPasswordActions.verifyVerificationCode', () => {
    it('should verify code', () => {
      const verificationCode = 'verfied-code';
      const result = reducer(initialState,
        ResetPasswordActions.verifyVerificationCode({ verificationCode }));
      expect(result.data.verificationCode).toEqual(verificationCode);
      expect(result.error).toEqual(null);
      expect(result.isBusy).toEqual(true);
    });
  });

  describe('resetPasswordActions.verifyVerificationCodeSuccess', () => {
    it('should send verification code success', () => {
      const result = reducer(initialState,
        ResetPasswordActions.verifyVerificationCodeSuccess());
      expect(result.isBusy).toEqual(false);
      expect(result.error).toEqual(null);
    });
  });

  describe('resetPasswordActions.verifyVerificationCodeFailure', () => {
    it('should set error', () => {
      const error = {
        code: 500,
        message: 'error message',
        cloudError: null
      };
      const result = reducer(initialState,
        ResetPasswordActions.verifyVerificationCodeFailure({
          error
        }));
      expect(result.error).toEqual(error);
      expect(result.isBusy).toEqual(false);
    });
  });

  describe('resetPasswordActions.resetPassword', () => {
    it('should verify code', () => {
      const newPassword = 'new-password';
      const result = reducer(initialState,
        ResetPasswordActions.resetPassword({ newPassword }));
      expect(result.data.newPassword).toEqual(newPassword);
      expect(result.error).toEqual(null);
      expect(result.isBusy).toEqual(true);
    });
  });

  describe('resetPasswordActions.resetPasswordSuccess', () => {
    it('should reset password success', () => {
      const result = reducer(initialState,
        ResetPasswordActions.resetPasswordSuccess());
      expect(result.isBusy).toEqual(false);
      expect(result.error).toEqual(null);
    });
  });

  describe('resetPasswordActions.resetPasswordFailure', () => {
    it('should set error', () => {
      const error = {
        code: 500,
        message: 'error message',
        cloudError: null
      };
      const result = reducer(initialState,
        ResetPasswordActions.resetPasswordFailure({
          error
        }));
      expect(result.error).toEqual(error);
      expect(result.isBusy).toEqual(false);
    });
  });

  describe('resetPasswordActions.resetError', () => {
    it('should reset error', () => {
      const result = reducer(initialState,
        ResetPasswordActions.resetError());
      expect(result.error).toEqual(null);
    });
  });

});
