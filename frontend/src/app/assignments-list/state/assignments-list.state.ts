import { ActionReducerMap } from '@ngrx/store';
import * as fromMain from './assignments-list.reducer';
import * as fromNewAssignments from './columns-reducers/new-assignments.reducer';
import * as fromReadyToPlanAssignments from './columns-reducers/ready-to-plan-assignments.reducer';
import * as fromOngoing from './columns-reducers/ongoing-assignments.reducer';
import * as fromClosed from './columns-reducers/closed-assignments.reducer';
import { ColumnState } from './column-state';

export interface AssignmentsListState {
  main: fromMain.MainState;
  newAssignments: ColumnState;
  readyToPlan: ColumnState;
  ongoing: ColumnState;
  closed: ColumnState;
}

export const reducers: ActionReducerMap<AssignmentsListState> = {
  main: fromMain.reducer,
  newAssignments: fromNewAssignments.reducer,
  readyToPlan: fromReadyToPlanAssignments.reducer,
  ongoing: fromOngoing.reducer,
  closed: fromClosed.reducer,
};
