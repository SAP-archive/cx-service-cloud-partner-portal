import { createFeatureSelector, createSelector, select } from '@ngrx/store';
import * as fromTechnicians from './technicians.reducer';
import { adapter } from './technicians.reducer';

export const selectTechniciansState = createFeatureSelector<fromTechnicians.State>(
  fromTechnicians.techniciansFeatureKey
);

export const selectTechnicians = createSelector(
  selectTechniciansState,
  adapter.getSelectors().selectAll
);

export const selectIsLoading = createSelector(
  selectTechniciansState,
  state => state.isLoading
);

export const selectFetchingParams = createSelector(
  selectTechniciansState,
  state => state.fetchingParams
);

export const selectHasFetchedAll = createSelector(
  selectFetchingParams,
  state => state.pagesLoaded >= state.totalPages
);

export const selectTotalElements = createSelector(
  selectFetchingParams,
  state => state.totalElements
);
