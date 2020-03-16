import { ActionReducerMap } from '@ngrx/store';
import * as fromConfig from './config/config.reducer';
import * as fromUser from './user/user.reducer';

export interface RootState {
  config: fromConfig.State;
  user: fromUser.UserState;
}

export const reducers: ActionReducerMap<RootState> = {
  config: fromConfig.reducer,
  user: fromUser.reducer,
};
