import { createAction, props } from '@ngrx/store';

export const setBaseUrl = createAction(
  '[Config] Set base URL',
  props<{ url: string }>(),
);
