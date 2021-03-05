import { Action, createReducer, on } from '@ngrx/store';
import { EmbeddedConfig, getEmbeddedConfig } from '../../../environments/embedded-config';
import * as appConfigFile from '../../../../../appconfig.json';
import { loginSuccess } from '../../auth-module/state/auth/auth.actions';
import { CompanySettings } from '../../model/company-settings';
import { fetchCompanySettingsSuccess } from './config.actions';

export interface State {
  embeddedConfig: EmbeddedConfig;
  appConfig: any;
  maxAttachmentSize: number;
  companySettings: CompanySettings;
}

export const initialState: State = {
  embeddedConfig: getEmbeddedConfig(),
  appConfig: appConfigFile.appConfig,
  maxAttachmentSize: 0,
  companySettings: {},
};

export const configReducer = createReducer(
  initialState,
  on(loginSuccess, (state, {loginData}) => ({
    ...state,
    maxAttachmentSize: loginData.maxAttachmentSize,
  })),

  on(fetchCompanySettingsSuccess, (state, {settings}) => ({
    ...state,
    companySettings: settings,
  })),
);

export function reducer(state: State, action: Action) {
  return configReducer(state, action);
}
