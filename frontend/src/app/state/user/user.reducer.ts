import { Action, createReducer, on } from '@ngrx/store';
import { setCurrentLocalisation, setPerson, hasLocalisationBeenChangedBeforeLogin, selectLocalisation } from './user.actions';
import { findLocalisation } from '../../components/localisation-selector/localisations';
import { Localisation } from '../../components/localisation-selector/localisation';
import { loginSuccess } from '../../auth-module/state/auth/auth.actions';
import { UnifiedPerson } from '../../model/unified-person.model';

export interface UserState {
  person: UnifiedPerson;
  canModifyProfile: boolean;
  canModifyConnections: boolean;
  email: string;
  localisation: Localisation;
  isLocalisationChangeNeeded: boolean;
}

export const userDefaultState: UserState = {
  person: null,
  canModifyProfile: false,
  canModifyConnections: false,
  email: null,
  localisation: findLocalisation('en'),
  isLocalisationChangeNeeded: false,
};

export const userReducer = createReducer(
  userDefaultState,
  on(setPerson, (state, {person}) => ({...state, person})),
  on(setCurrentLocalisation, (state, {localisation}) => ({
    ...state,
    localisation: {...localisation}
  })
  ),
  on(selectLocalisation, (state, {localisation}) => ({
    ...state,
    localisation: {...localisation}
  })),
  on(hasLocalisationBeenChangedBeforeLogin, (state, {isLocalisationChangeNeeded}) => ({
    ...state,
    isLocalisationChangeNeeded})
  ),
  on(loginSuccess, (state, {loginData}) => ({
    ...state,
    person: loginData.person
  })),
);

export function reducer(state: UserState, action: Action) {
  return userReducer(state, action);
}
