import { createAction, props } from '@ngrx/store';
import { Assignment } from '../model/assignment';
import { CrowdApiResponse } from '../../technicians-list-module/models/crowd-api-response.model';
import { ColumnName } from '../model/column-name';
import { FetchingFilter } from '../model/fetching-filter';

export const reset = createAction(
  '[Assignments] Reset',
);

export const setFilter = createAction(
  '[Assignments] Set filter for column of Assignments',
  props<{ columnName: ColumnName, fetchingFilter: FetchingFilter }>(),
);

export const loadNextPage = createAction(
  '[Assignments] Load next page of Assignments',
  props<{ columnName: ColumnName }>(),
);

export const loadNextPageSuccess = createAction(
  '[Assignments] Load next page of Assignments Success',
  props<{ columnName: ColumnName, response: CrowdApiResponse<Assignment> }>(),
);

export const loadNextPageFailure = createAction(
  '[Assignments] Load next page of Assignments Failure',
  props<{ columnName: ColumnName }>(),
);

export const reject = createAction(
  '[Assignments] reject Assignment',
  props<{ assignment: Assignment }>(),
);

export const rejectSuccess = createAction(
  '[Assignments] reject Assignment Success',
  props<{ id: string }>(),
);

export const rejectFailure = createAction(
  '[Assignments] reject Assignment Failure',
);

export const accept = createAction(
  '[Assignments] accept Assignment',
  props<{ assignment: Assignment }>(),
);

export const acceptSuccess = createAction(
  '[Assignments] accept Assignment Success',
  props<{ assignment: Assignment }>(),
);

export const acceptFailure = createAction(
  '[Assignments] accept Assignment Failure',
);

export const release = createAction(
  '[Assignments] release Assignment',
  props<{ assignment: Assignment }>(),
);

export const releaseSuccess = createAction(
  '[Assignments] release Assignment Success',
  props<{ assignment: Assignment }>(),
);

export const releaseFailure = createAction(
  '[Assignments] release Assignment Failure',
);

export const close = createAction(
  '[Assignments] close Assignment',
  props<{ assignment: Assignment }>(),
);

export const closeSuccess = createAction(
  '[Assignments] close Assignment Success',
  props<{ assignment: Assignment }>(),
);

export const closeFailure = createAction(
  '[Assignments] close Assignment Failure',
);

export const startDragging = createAction(
  '[Assignments] start dragging Assignment',
  props<{ assignment: Assignment }>(),
);

export const endDragging = createAction(
  '[Assignments] end dragging Assignment',
);
