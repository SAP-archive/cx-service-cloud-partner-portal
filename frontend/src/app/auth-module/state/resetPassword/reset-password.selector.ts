import { createSelector } from '@ngrx/store';
import { selectAuthFeature } from 'src/app/auth-module/feature.selectors';

export const selectResetPasswordState = createSelector(
  selectAuthFeature,
  state => state.resetPassword,
);

export const selectIsBusy = createSelector(
  selectResetPasswordState,
  state => state.isBusy,
);

export const selectResetPasswordData = createSelector(
  selectResetPasswordState,
  state => state.data,
);

export const selectResetPasswordError = createSelector(
  selectResetPasswordState,
  state => state.error,
);
