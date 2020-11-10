import { Action, createReducer, on } from '@ngrx/store';
import * as AssignmentsActions from './assignments-list.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Assignment } from '../model/assignment';
import { emptyFetchingParams, FetchingParams } from '../model/fetching-params.model';
import { ColumnName } from '../model/column-name';
import * as _ from 'lodash';
import { RecursivePartial } from '../../utils/recursive-partial';

export const assignmentsListFeatureKey = 'assignmentsList';

export interface State extends EntityState<Assignment> {
  isUpdating: boolean;
  originalAssignment: Assignment | null;
  draggedAssignment: Assignment | null;
  newAssignments: ColumnState;
  readyToPlanAssignments: ColumnState;
  ongoingAssignments: ColumnState;
  closedAssignments: ColumnState;
}

export interface ColumnState {
  isLoading: boolean;
  fetchingParams: FetchingParams;
}

export const adapter: EntityAdapter<Assignment> = createEntityAdapter<Assignment>({
  selectId: assignment => assignment.id,
});

export const initialState = (): State => adapter.getInitialState({
  isUpdating: false,
  originalAssignment: null,
  draggedAssignment: null,
  newAssignments: {
    isLoading: false,
    fetchingParams: emptyFetchingParams(),
  },
  readyToPlanAssignments: {
    isLoading: false,
    fetchingParams: emptyFetchingParams(),
  },
  ongoingAssignments: {
    isLoading: false,
    fetchingParams: emptyFetchingParams(),
  },
  closedAssignments: {
    isLoading: false,
    fetchingParams: emptyFetchingParams(),
  },
});

export const getColumnStateName = (columnName: ColumnName): string => {
  switch (columnName) {
    case 'ASSIGNMENTS_BOARD_NEW':
      return 'newAssignments';
    case 'ASSIGNMENTS_BOARD_READY_TO_PLAN':
      return 'readyToPlanAssignments';
    case 'ASSIGNMENTS_BOARD_ONGOING':
      return 'ongoingAssignments';
    case 'ASSIGNMENTS_BOARD_CLOSED':
      return 'closedAssignments';
    default:
      throw new Error(`Unknown column: ${columnName}`);
  }
};

const getColumnState = (state, columnName: ColumnName): ColumnState => {
  return state[getColumnStateName(columnName)];
};

const getWithUpdatedColumnState = (state: State, columnName: ColumnName, updatedFields: RecursivePartial<ColumnState>): State => {
  const columnStateName = getColumnStateName(columnName);
  return {
    ...state,
    [columnStateName]: _.merge(
      {},
      state[columnStateName] as ColumnState,
      updatedFields,
    ),
  };
};

const getAssignmentById = (state: State, id: string) => adapter.getSelectors().selectAll(state).find(assignment => assignment.id === id);

const assignmentsListReducer = createReducer(
  initialState(),

  on(
    AssignmentsActions.reset,
    () => initialState(),
  ),

  on(
    AssignmentsActions.setFilter,
    (state, {columnName, fetchingFilter}) =>
      getWithUpdatedColumnState(state, columnName, {
        fetchingParams: {
          filter: fetchingFilter,
        },
      }),
  ),

  on(
    AssignmentsActions.loadNextPage,
    (state, {columnName}) => {
      return getWithUpdatedColumnState(state, columnName, {isLoading: true});
    },
  ),

  on(
    AssignmentsActions.loadNextPageSuccess,
    (state, {columnName, response}): State =>
      adapter.addMany(response.results, getWithUpdatedColumnState(
        state,
        columnName,
        {
          isLoading: false,
          fetchingParams: {
            pagesLoaded: getColumnState(state, columnName).fetchingParams.pagesLoaded + 1,
            totalPages: response.totalPages,
            totalElements: response.totalElements,
          },
        },
      )),
  ),

  on(
    AssignmentsActions.loadNextPageFailure,
    (state, {columnName}) => {
      return getWithUpdatedColumnState(state, columnName, {isLoading: false});
    },
  ),

  on(
    AssignmentsActions.reject,
    (state, {assignment}) => ({
      ...adapter.removeOne(assignment.id, state),
      originalAssignment: getAssignmentById(state, assignment.id),
      isUpdating: true,
    }),
  ),

  on(
    AssignmentsActions.rejectSuccess,
    (state) => ({
      ...state,
      isUpdating: false,
    }),
  ),

  on(
    AssignmentsActions.rejectFailure,
    (state) => ({
      ...adapter.addOne(state.originalAssignment, state),
      isUpdating: false,
      originalAssignment: null,
    }),
  ),

  on(
    AssignmentsActions.accept,
    (state, {assignment}) => ({
      ...adapter.updateOne({
        id: assignment.id,
        changes: {partnerDispatchingStatus: 'ACCEPTED'},
      }, state),
      originalAssignment: getAssignmentById(state, assignment.id),
      isUpdating: true,
    }),
  ),

  on(
    AssignmentsActions.release,
    (state, {assignment}) => ({
      ...adapter.updateOne({
        id: assignment.id,
        changes: assignment,
      }, state),
      originalAssignment: getAssignmentById(state, assignment.id),
      isUpdating: true,
    }),
  ),

  on(
    AssignmentsActions.close,
    (state, {assignment}) => ({
      ...adapter.updateOne({
        id: assignment.id,
        changes: assignment,
      }, state),
      originalAssignment: getAssignmentById(state, assignment.id),
      isUpdating: true,
    }),
  ),

  on(
    AssignmentsActions.acceptSuccess, AssignmentsActions.releaseSuccess, AssignmentsActions.closeSuccess,
    (state, {assignment}) => ({
      ...adapter.updateOne({
        id: assignment.id,
        changes: assignment,
      }, state),
      isUpdating: false,
      originalAssignment: null,
    }),
  ),

  on(
    AssignmentsActions.acceptFailure, AssignmentsActions.releaseFailure, AssignmentsActions.closeFailure,
    (state) => ({
      ...adapter.updateOne({
        id: state.originalAssignment.id,
        changes: state.originalAssignment,
      }, state),
      isUpdating: false,
      originalAssignment: null,
    }),
  ),

  on(
    AssignmentsActions.startDragging,
    (state, {assignment}) => ({
      ...state,
      draggedAssignment: assignment,
    }),
  ),

  on(
    AssignmentsActions.endDragging,
    (state) => ({
      ...state,
      draggedAssignment: null,
    }),
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return assignmentsListReducer(state, action);
}
