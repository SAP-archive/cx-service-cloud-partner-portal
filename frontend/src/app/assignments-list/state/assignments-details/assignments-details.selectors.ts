import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAssignmentsDetails from './assignments-details.reducer';
import { adapter } from './assignments-details.reducer';

export const selectAssignmentsDetailsState = createFeatureSelector<fromAssignmentsDetails.State>(
    fromAssignmentsDetails.assignmentsDetailsFeatureKey,
);

export const selectTechnicians = createSelector(
    selectAssignmentsDetailsState,
    adapter.getSelectors().selectAll,
);

export const selectIsLoading = createSelector(
    selectAssignmentsDetailsState,
    state => state.isLoading,
);

export const selectDisplayedAssignment = createSelector(
    selectAssignmentsDetailsState,
    state => state.displayedAssignment,
);

export const selectDisplayMode = createSelector(
    selectAssignmentsDetailsState,
    state => state.displayMode,
);
