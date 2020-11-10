import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAssignments from './assignments-list.reducer';
import { adapter } from './assignments-list.reducer';

export const selectAssignmentsState = createFeatureSelector<fromAssignments.State>(
  fromAssignments.assignmentsListFeatureKey,
);

export const selectAssignments = createSelector(
  selectAssignmentsState,
  adapter.getSelectors().selectAll,
);

export const selectNewAssignments = createSelector(
  selectAssignments,
  state => state.filter(assignment => assignment.partnerDispatchingStatus === 'NOTIFIED'),
);

export const selectReadyToPlanAssignments = createSelector(
  selectAssignments,
  state =>
    state.filter(assignment => assignment.partnerDispatchingStatus === 'ACCEPTED'
      && assignment.serviceAssignmentState === 'ASSIGNED'),
);

export const selectOngoingAssignments = createSelector(
  selectAssignments,
  state => state.filter(assignment => assignment.serviceAssignmentState === 'RELEASED'),
);

export const selectClosedAssignments = createSelector(
  selectAssignments,
  state => state.filter(assignment => assignment.serviceAssignmentState === 'CLOSED'),
);

export const selectIsLoadingNewAssignments = createSelector(
  selectAssignmentsState,
  state => state.newAssignments.isLoading,
);

export const selectIsLoadingReadyToPlanAssignments = createSelector(
  selectAssignmentsState,
  state => state.readyToPlanAssignments.isLoading,
);

export const selectIsLoadingOngoingAssignments = createSelector(
  selectAssignmentsState,
  state => state.ongoingAssignments.isLoading,
);

export const selectIsLoadingClosedAssignments = createSelector(
  selectAssignmentsState,
  state => state.closedAssignments.isLoading,
);

export const selectIsUpdating = createSelector(
  selectAssignmentsState,
  state => state.isUpdating,
);

export const selectNewAssignmentsFetchingParams = createSelector(
  selectAssignmentsState,
  state => state.newAssignments.fetchingParams,
);

export const selectReadyToPlanAssignmentsFetchingParams = createSelector(
  selectAssignmentsState,
  state => state.readyToPlanAssignments.fetchingParams,
);

export const selectOngoingAssignmentsFetchingParams = createSelector(
  selectAssignmentsState,
  state => state.ongoingAssignments.fetchingParams,
);

export const selectClosedAssignmentsFetchingParams = createSelector(
  selectAssignmentsState,
  state => state.closedAssignments.fetchingParams,
);

export const selectHasFetchedAllNewAssignments = createSelector(
  selectNewAssignmentsFetchingParams,
  state => state.pagesLoaded !== 0 && state.pagesLoaded >= state.totalPages,
);

export const selectHasFetchedAllReadyToPlanAssignments = createSelector(
  selectReadyToPlanAssignmentsFetchingParams,
  state => state.pagesLoaded !== 0 && state.pagesLoaded >= state.totalPages,
);

export const selectHasFetchedAllOngoingAssignments = createSelector(
  selectOngoingAssignmentsFetchingParams,
  state => state.pagesLoaded !== 0 && state.pagesLoaded >= state.totalPages,
);

export const selectHasFetchedAllClosedAssignments = createSelector(
  selectClosedAssignmentsFetchingParams,
  state => state.pagesLoaded !== 0 && state.pagesLoaded >= state.totalPages,
);

export const selectDraggedAssignment = createSelector(
  selectAssignmentsState,
  state => state.draggedAssignment,
);
