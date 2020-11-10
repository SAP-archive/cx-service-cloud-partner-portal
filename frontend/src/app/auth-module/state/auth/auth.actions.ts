import { createAction, props } from '@ngrx/store';
import { Credentials } from '../../model/credentials.model';
import { LoginData } from '../../model/login-data.model';
import { ClientError } from '../../../model/client-error';

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: Credentials }>(),
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ loginData: LoginData }>(),
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
);

export const setRedirectTo = createAction(
  '[Auth] Set Redirect To',
  props<{ route: string }>(),
);

export const passwordChangeNeeded = createAction(
  '[Auth] Password Change Needed',
);

export const changePassword = createAction(
  '[Auth] Change Password',
  props<{ newPassword: string }>(),
);

export const changePasswordSuccess = createAction(
  '[Auth] Change Password Success',
);

export const changePasswordFailure = createAction(
  '[Auth] Change Password Failure',
  props<{ error: ClientError }>(),
);

export const logout = createAction(
  '[Auth] Logout',
);

export const logoutSuccess = createAction(
  '[Auth] Logout Success',
);

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
);
