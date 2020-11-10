import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthData, emptyAuthData } from '../../model/auth-data.model';
import { ClientError } from '../../../model/client-error';

export const authFeatureKey = 'auth';

export interface State {
  isBusy: boolean;
  redirectTo: string;
  authUserData: AuthData;
  error: ClientError | null;
}

export const initialState: State = {
  isBusy: false,
  redirectTo: null,
  error: null,
  authUserData: emptyAuthData(),
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state, { credentials }) => ({
    ...state,
    isBusy: true,
    authUserData: {
      ...state.authUserData,
      userName: credentials.userName,
      accountName: credentials.accountName,
      password: credentials.password,
    }
  })),
  on(AuthActions.loginSuccess, (state, { loginData }) => ({
    ...state,
    isBusy: false,
    authUserData: { ...loginData.authData },
  })),
  on(AuthActions.loginFailure, (state) => ({ ...state, isBusy: false, authUserData: { ...state.authUserData, password: null } })),
  on(AuthActions.setRedirectTo, (state, { route }) => ({ ...state, redirectTo: route })),
  on(AuthActions.passwordChangeNeeded, (state) => ({ ...state, isBusy: false })),
  on(AuthActions.changePassword, (state) => ({ ...state, isBusy: true, error: null })),
  on(AuthActions.changePasswordSuccess, (state) => ({ ...state, isBusy: false })),
  on(AuthActions.changePasswordFailure, (state, { error }) => {
    return { ...state, isBusy: false, error };
  }),
);

export function reducer(state: State | undefined, action: Action) {
  return authReducer(state, action);
}
