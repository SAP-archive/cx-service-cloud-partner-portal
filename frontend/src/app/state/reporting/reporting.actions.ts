import { createAction, props } from '@ngrx/store';

export const reportError = createAction(
  '[Reporting] Report Error',
  props<{ message?: string }>(),
);

export const reportSuccess = createAction(
  '[Reporting] Report Success',
  props<{ message?: string }>(),
);

export const reportWarning = createAction(
  '[Reporting] Report Warning',
  props<{ message?: string }>(),
);
