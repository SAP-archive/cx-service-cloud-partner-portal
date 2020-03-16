import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTechnicians from './technicians.reducer';

export const selectTechniciansState = createFeatureSelector<fromTechnicians.State>(
  fromTechnicians.techniciansFeatureKey
);

export const selectTechnicians = createSelector(
  selectTechniciansState,
  state => state.technicians
);

export const selectIsLoading = createSelector(
  selectTechniciansState,
  state => state.isLoading
);
