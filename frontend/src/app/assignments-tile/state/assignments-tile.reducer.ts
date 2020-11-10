import { Action, createReducer, on } from '@ngrx/store';
import * as AssignmentsTileActions from './assignments-tile.actions';
import { AssignmentsStats, emptyAssignmentsStats } from '../model/assignments-stats';

export const assignmentsTileFeatureKey = 'assignmentsTile';

export interface State {
  assignmentsStats: AssignmentsStats;
  isLoading: boolean;
}

export const initialState = (): State => ({
  assignmentsStats: emptyAssignmentsStats(),
  isLoading: false,
});

const assignmentsTileReducer = createReducer(
  initialState(),

  on(
    AssignmentsTileActions.loadAssignmentsStats,
    (state) => ({
      ...state,
      isLoading: true,
    }),
  ),

  on(
    AssignmentsTileActions.loadAssignmentsStatsSuccess,
    (state, {assignmentsStats}): State => ({
      assignmentsStats,
      isLoading: false,
    }),
  ),

  on(
    AssignmentsTileActions.loadAssignmentsStatsFailure, (state) => ({
      ...state,
      isLoading: false,
    }),
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return assignmentsTileReducer(state, action);
}
