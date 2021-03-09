import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAssignments from './assignments-list.reducer';
import * as fromNewAssignments from './columns-reducers/new-assignments.reducer';
import * as fromReadyToPlanAssignments from './columns-reducers/ready-to-plan-assignments.reducer';
import * as fromOngoing from './columns-reducers/ongoing-assignments.reducer';
import * as fromClosed from './columns-reducers/closed-assignments.reducer';
import { AssignmentsListState } from './assignments-list.state';
import { ColumnState } from './column-state';
import { FetchingParams } from '../model/fetching-params.model';

export const getFetchingParamsFromColumnState = ({
                                                   pagesLoaded,
                                                   totalElements,
                                                   totalPages,
                                                   filter,
                                                 }: ColumnState): FetchingParams => ({
  pagesLoaded,
  totalElements,
  totalPages,
  filter,
});

export const selectAssignmentsState = createFeatureSelector<AssignmentsListState>(
  fromAssignments.assignmentsListFeatureKey,
);

export const selectMainState = createSelector(
  selectAssignmentsState,
  state => state.main,
);

export const selectNewAssignmentsState = createSelector(
  selectAssignmentsState,
  state => state.newAssignments,
);

export const selectReadyToPlanState = createSelector(
  selectAssignmentsState,
  state => state.readyToPlan,
);

export const selectOngoingState = createSelector(
  selectAssignmentsState,
  state => state.ongoing,
);

export const selectClosedState = createSelector(
  selectAssignmentsState,
  state => state.closed,
);

export const selectNewAssignments = createSelector(
  selectNewAssignmentsState,
  fromNewAssignments.adapter.getSelectors().selectAll,
);

export const selectReadyToPlanAssignments = createSelector(
  selectReadyToPlanState,
  fromReadyToPlanAssignments.adapter.getSelectors().selectAll,
);

export const selectOngoingAssignments = createSelector(
  selectOngoingState,
  fromOngoing.adapter.getSelectors().selectAll,
);

export const selectClosedAssignments = createSelector(
  selectClosedState,
  fromClosed.adapter.getSelectors().selectAll,
);

export const selectIsLoadingNewAssignments = createSelector(
  selectNewAssignmentsState,
  state => state.isLoading,
);

export const selectIsLoadingReadyToPlanAssignments = createSelector(
  selectReadyToPlanState,
  state => state.isLoading,
);

export const selectIsLoadingOngoingAssignments = createSelector(
  selectOngoingState,
  state => state.isLoading,
);

export const selectIsLoadingClosedAssignments = createSelector(
  selectClosedState,
  state => state.isLoading,
);

export const selectIsUpdating = createSelector(
  selectMainState,
  state => state.isUpdating,
);

export const selectNewAssignmentsFetchingParams = createSelector(
  selectNewAssignmentsState,
  state => getFetchingParamsFromColumnState(state),
);

export const selectReadyToPlanAssignmentsFetchingParams = createSelector(
  selectReadyToPlanState,
  state => getFetchingParamsFromColumnState(state),
);

export const selectOngoingAssignmentsFetchingParams = createSelector(
  selectOngoingState,
  state => getFetchingParamsFromColumnState(state),
);

export const selectClosedAssignmentsFetchingParams = createSelector(
  selectClosedState,
  state => getFetchingParamsFromColumnState(state),
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
  selectMainState,
  state => state.draggedAssignment,
);

const selectTotalElements = (state: ColumnState) => state.totalElements;

export const selectNewAssignmentsTotal = createSelector(
  selectNewAssignmentsState,
  selectTotalElements,
);

export const selectReadyToPlanAssignmentsTotal = createSelector(
  selectReadyToPlanState,
  selectTotalElements,
);

export const selectOngoingAssignmentsTotal = createSelector(
  selectOngoingState,
  selectTotalElements,
);

export const selectClosedAssignmentsTotal = createSelector(
  selectClosedState,
  selectTotalElements,
);
