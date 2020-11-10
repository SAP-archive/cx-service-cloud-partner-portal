import { createSelector } from '@ngrx/store';
import { selectAuthFeature } from '../../feature.selectors';

export const selectAuthState = createSelector(
  selectAuthFeature,
  state => state.auth,
);

export const selectIsBusy = createSelector(
  selectAuthState,
  state => state.isBusy,
);

export const selectAuthUserData = createSelector(
  selectAuthState,
  state => state.authUserData,
);

export const selectRedirectTo = createSelector(
  selectAuthState,
  state => state.redirectTo,
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  state => !!state.authUserData.authToken,
);

export const selectCompanyName = createSelector(
  selectAuthState,
  state => state.authUserData.companyName,
);

export const selectError = createSelector(
  selectAuthState,
  state => state.error,
);

export const selectPasswordPolicyError = createSelector(
  selectError,
  error => (error && error.message === 'PASSWORD_NOT_VALID') ? error : null,
);
