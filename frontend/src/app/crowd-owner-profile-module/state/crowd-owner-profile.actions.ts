import { createAction, props } from '@ngrx/store';
import { ContactDetails } from '../model/contact-details';

export const loadCompanyContact = createAction(
  '[CrowdOwnerProfile] Load CompanyContact',
);

export const loadCompanyContactSuccess = createAction(
  '[CrowdOwnerProfile] Load CompanyContact Success',
  props<{contactDetails: ContactDetails}>(),
);

export const loadCompanyContactFailure = createAction(
  '[CrowdOwnerProfile] Load CompanyContact Failure',
);

export const loadCompanyLogo = createAction(
  '[CrowdOwnerProfile] Load Company Logo',
);

export const loadCrowdName = createAction(
  '[CrowdOwnerProfile] Load Crowd Name',
);

export const loadCrowdNameSuccess = createAction(
  '[CrowdOwnerProfile] Load Crowd Name Success',
  props<{crowdName: string}>(),
);

export const loadCrowdNameFailure = createAction(
  '[CrowdOwnerProfile] Load Crowd Name Failure',
);

export const loadCompanyLogoSuccess = createAction(
  '[CrowdOwnerProfile] Load Company Logo Success',
  props<{companyLogo: string}>(),
);

export const loadCompanyLogoFailure = createAction(
  '[CrowdOwnerProfile] Load Company Logo Failure',
);
