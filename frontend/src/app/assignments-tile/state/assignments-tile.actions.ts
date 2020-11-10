import { createAction, props } from '@ngrx/store';
import { AssignmentsStats } from '../model/assignments-stats';

export const loadAssignmentsStats = createAction(
  '[AssignmentsTile] Load Assignments Stats',
);

export const loadAssignmentsStatsSuccess = createAction(
  '[AssignmentsTile] Load Assignments Stats Success',
  props<{assignmentsStats: AssignmentsStats}>(),
);

export const loadAssignmentsStatsFailure = createAction(
  '[AssignmentsTile] Load Assignments Stats Failure',
);
