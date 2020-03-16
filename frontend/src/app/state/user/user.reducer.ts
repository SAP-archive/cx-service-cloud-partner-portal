import { Action, createReducer, on } from '@ngrx/store';
import { changeLocalisation, setPerson } from './user.actions';
import { findLocalisation } from '../../components/localisation-selector/localisations';
import { Localisation } from '../../components/localisation-selector/localisation';
import { loginSuccess } from '../../auth-module/state/auth.actions';
import { UnifiedPerson } from '../../model/unified-person.model';

export interface UserState {
  person: UnifiedPerson;
  canModifyProfile: boolean;
  canModifyConnections: boolean;
  email: string;
  localisation: Localisation;
}

export const userDefaultState: UserState = {
  person: null,
  canModifyProfile: false,
  canModifyConnections: false,
  email: null,
  localisation: findLocalisation('en'),
};

export const userReducer = createReducer(
  userDefaultState,
  on(setPerson, (state, {person}) => ({...state, person})),
  on(changeLocalisation, (state, {localisation}) => ({...state, localisation: {...localisation}})),
  on(loginSuccess, (state, {loginData}) => ({
    ...state,
    person: loginData.person,
    localisation: loginData.localisation ? {...loginData.localisation} : {...state.localisation},
  })),
);

export function reducer(state: UserState, action: Action) {
  return userReducer(state, action);
}
