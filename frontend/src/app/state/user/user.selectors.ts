import { createSelector } from '@ngrx/store';
import * as fromRoot from '../index';
import * as fromUser from './user.reducer';

export const selectUser = (state: fromRoot.RootState) => state.user;

export const selectPerson = createSelector(
  selectUser,
  (state: fromUser.UserState) => state.person,
);

export const selectLocalisation = createSelector(
  selectUser,
  (state: fromUser.UserState) => state.localisation,
);
