import { Action, createReducer, on } from '@ngrx/store';
import * as AssignmentsActions from './assignments-list.actions';
import { Assignment } from '../model/assignment';

export const assignmentsListFeatureKey = 'assignmentsList';

export interface MainState {
  isUpdating: boolean;
  originalAssignment: Assignment | null;
  draggedAssignment: Assignment | null;
}

export const initialState = (): MainState => ({
  isUpdating: false,
  originalAssignment: null,
  draggedAssignment: null,
});

const assignmentsListReducer = createReducer(
  initialState(),

  on(
    AssignmentsActions.reset,
    () => initialState(),
  ),

  on(
    AssignmentsActions.reject,
    AssignmentsActions.accept,
    AssignmentsActions.release,
    AssignmentsActions.handover,
    AssignmentsActions.close,
    (state) => ({
      ...state,
      isUpdating: true,
    }),
  ),

  on(
    AssignmentsActions.rejectSuccess,
    AssignmentsActions.rejectFailure,
    AssignmentsActions.acceptSuccess,
    AssignmentsActions.acceptFailure,
    AssignmentsActions.releaseSuccess,
    AssignmentsActions.releaseFailure,
    AssignmentsActions.handoverSuccess,
    AssignmentsActions.handoverFailure,
    AssignmentsActions.closeSuccess,
    AssignmentsActions.closeFailure,
    (state) => ({
      ...state,
      isUpdating: false,
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

export function reducer(state: MainState | undefined, action: Action) {
  return assignmentsListReducer(state, action);
}
