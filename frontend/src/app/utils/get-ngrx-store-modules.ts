import { Action, ActionReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, RootState } from '../state';
import { environment } from '../../environments/environment';
import { localStorageSync } from 'ngrx-store-localstorage';
import * as AuthActions from '../auth-module/state/auth.actions';

export function localStorageSyncReducer(reducer: ActionReducer<RootState>): ActionReducer<RootState> {
  return localStorageSync({
    keys: [
      {auth: ['authUserData']},
      {user: ['person']},
      {config: ['maxAttachmentSize']},
    ],
    rehydrate: true,
  })(reducer);
}

export function logoutReducer(reducer: ActionReducer<RootState>): ActionReducer<RootState> {
  return function (state: RootState, action: Action) {
    return reducer(action.type === AuthActions.logoutSuccess.type ? undefined : state, action);
  };
}

const storeModule = StoreModule.forRoot(reducers, {
  runtimeChecks: {
    strictStateImmutability: true,
    strictActionImmutability: true,
    strictStateSerializability: true,
    strictActionSerializability: false,
  },
  metaReducers: [localStorageSyncReducer, logoutReducer],
});

const storeDevtoolsModule = StoreDevtoolsModule.instrument({
  maxAge: 25,
});

export const ngrxStoreModules = environment.production ? [storeModule] : [storeModule, storeDevtoolsModule];
