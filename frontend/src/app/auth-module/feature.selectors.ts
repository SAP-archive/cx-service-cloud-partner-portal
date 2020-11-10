import { createFeatureSelector } from '@ngrx/store';
import * as fromResetPassword  from './state/resetPassword/reset-password.reducer';
import * as fromAuth from './state/auth/auth.reducer';

export const authRootKey = 'authRoot';

export interface AuthFeatureState {
  auth: fromAuth.State;
  resetPassword: fromResetPassword.State;
}

export const selectAuthFeature = createFeatureSelector<AuthFeatureState>(
  authRootKey,
);
