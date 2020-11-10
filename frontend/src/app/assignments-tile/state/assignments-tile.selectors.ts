import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAssignments from './assignments-tile.reducer';

export const selectAssignmentsState = createFeatureSelector<fromAssignments.State>(
  fromAssignments.assignmentsTileFeatureKey,
);

export const selectAssignmentsStats = createSelector(
  selectAssignmentsState,
  state => state.assignmentsStats,
);

export const selectIsLoading = createSelector(
  selectAssignmentsState,
  state => state.isLoading,
);
