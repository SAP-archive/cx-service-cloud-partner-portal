import { Action, createReducer, on } from '@ngrx/store';
import { EmbeddedConfig, getEmbeddedConfig } from '../../../environments/embedded-config';
import * as appConfigFile from '../../../../../appconfig.json';
import { loginSuccess } from '../../auth-module/state/auth.actions';

export interface State {
  embeddedConfig: EmbeddedConfig;
  appConfig: any;
  maxAttachmentSize: number;
}

export const initialState: State = {
  embeddedConfig: getEmbeddedConfig(),
  appConfig: appConfigFile.appConfig,
  maxAttachmentSize: 0,
};

export const configReducer = createReducer(
  initialState,
  on(loginSuccess, (state, {loginData}) => ({
    ...state,
    maxAttachmentSize: loginData.maxAttachmentSize,
  })),
);

export function reducer(state: State, action: Action) {
  return configReducer(state, action);
}
