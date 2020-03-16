import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export const selectAuthState = createFeatureSelector<fromAuth.State>(
  fromAuth.authFeatureKey,
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
