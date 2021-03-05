import { createAction, props } from '@ngrx/store';
import { CompanySettings } from '../../model/company-settings';

export const setBaseUrl = createAction(
  '[Config] Set base URL',
  props<{ url: string }>(),
);

export const fetchCompanySettings = createAction(
  '[Config] fetch company settings',
);

export const fetchCompanySettingsSuccess = createAction(
  '[Config] fetch company settings success',
  props<{ settings: CompanySettings }>(),
);

export const fetchCompanySettingsFailure = createAction(
  '[Config] fetch company settings failure',
);
