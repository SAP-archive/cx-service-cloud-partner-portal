import { Action, createReducer, on } from '@ngrx/store';
import { ResetPasswordData, emptyResetPasswordData } from '../../model/reset-password-data.model';
import { RequestError } from '../../../auth-module/model/request-error.model';
import * as resetPasswordActions from './reset-password.actions';

export const resetPasswordFeatureKey = 'resetPassword';

export interface State {
  data: ResetPasswordData;
  isBusy: boolean;
  error: RequestError | null;
}

export const initialState: State = {
  data: emptyResetPasswordData(),
  isBusy: false,
  error: null
};

const resetPasswordReducer = createReducer(
  initialState,
  on(resetPasswordActions.setData, (state, { data }) => (
    {
      ...state,
      data: {
        ...state.data,
        ...data
      }
    }
  )),

  on(resetPasswordActions.fetchPartialEmailAddress, (state, { accountName, userName }) => (
    {
      ...state,
      data: {
        ...state.data,
        accountName,
        userName
      },
      error: null,
      isBusy: true
    }
  )),

  on(resetPasswordActions.fetchPartialEmailAddressSuccess, (state, { maskedEmail }) => (
    {
      ...state,
      data: {
        ...state.data,
        maskedEmail
      },
      isBusy: false
    }
  )),

  on(resetPasswordActions.fetchPartialEmailAddressFail, (state, { error }) => (
    {
      ...state,
      error,
      isBusy: false
    }
  )),

  on(resetPasswordActions.sendVerificationCode, (state, { email }) => (
    {
      ...state,
      data: {
        ...state.data,
        email
      },
      error: null,
      isBusy: true
    }
  )),

  on(resetPasswordActions.sendVerificationCodeSuccess, (state) => (
    {
      ...state,
      isBusy: false
    }
  )),

  on(resetPasswordActions.sendVerificationCodeFailure, (state, { error }) => (
    {
      ...state,
      error,
      isBusy: false
    }
  )),

  on(resetPasswordActions.resetData, () => initialState),

  on(resetPasswordActions.verifyVerificationCode, (state, { verificationCode }) => (
    {
      ...state,
      data: {
        ...state.data,
        verificationCode
      },
      error: null,
      isBusy: true
    }
  )),

  on(resetPasswordActions.verifyVerificationCodeSuccess, (state) => (
    {
      ...state,
      isBusy: false
    }
  )),

  on(resetPasswordActions.verifyVerificationCodeFailure, (state, { error }) => (
    {
      ...state,
      error,
      isBusy: false
    }
  )),

  on(resetPasswordActions.resetPassword, (state, { newPassword }) => (
    {
      ...state,
      data: {
        ...state.data,
        newPassword
      },
      error: null,
      isBusy: true
    }
  )),

  on(resetPasswordActions.resetPasswordSuccess, (state) => (
    {
      ...state,
      isBusy: false
    }
  )),

  on(resetPasswordActions.resetPasswordFailure, (state, { error }) => (
    {
      ...state,
      error,
      isBusy: false
    }
  )),

  on(resetPasswordActions.resetError, (state) => (
    {
      ...state,
      error: null
    }
  )),

);

export function reducer(state: State | undefined, action: Action) {
  return resetPasswordReducer(state, action);
}
