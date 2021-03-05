import { createSelector } from '@ngrx/store';
import * as fromRoot from '../index';
import * as fromConfig from './config.reducer';
import { CompanySettings } from '../../model/company-settings';

const isEmptyOrTrueString = (str: string | undefined) => !str || str === 'true';

export const selectConfig = (state: fromRoot.RootState) => state.config;

export const selectEmbeddedConfig = createSelector(
  selectConfig,
  (state: fromConfig.State) => state.embeddedConfig,
);

export const selectAppConfig = createSelector(
  selectConfig,
  (state: fromConfig.State) => state.appConfig,
);

export const selectMaxAttachmentSize = createSelector(
  selectConfig,
  (state: fromConfig.State) => state.maxAttachmentSize,
);

export const selectCompanySettings = createSelector(
  selectConfig,
  (state: fromConfig.State) => state.companySettings,
);

export const selectAllowAssignmentHandover = createSelector(
  selectCompanySettings,
  (state: CompanySettings) => isEmptyOrTrueString(state['SAP.FSM.Crowd.PartnerPortal.ReassignButtonDisplay']),
);

export const selectAllowAssignmentClose = createSelector(
  selectCompanySettings,
  (state: CompanySettings) => isEmptyOrTrueString(state['SAP.FSM.Crowd.PartnerPortal.CloseButtonDisplay']),
);

export const selectAllowReject = createSelector(
  selectCompanySettings,
  (state: CompanySettings) => isEmptyOrTrueString(state['SAP.FSM.Crowd.PartnerPortal.RejectButtonDisplay']),
);

export const selectAreCompanySettingsLoaded = createSelector(
  selectCompanySettings,
  (state: CompanySettings) => Object.keys(state).length > 0,
);
