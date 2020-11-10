import { createAction, props } from '@ngrx/store';
import { CompanyProfile } from '../model/company.profile';
import { Document } from '../model/document.model';
import { SaveCompanyProfileData } from '../model/save-company-profile-data';

export const loadCompanyProfile = createAction(
  '[CompanyProfile] Load CompanyProfile',
);

export const loadCompanyProfileSuccess = createAction(
  '[CompanyProfile] Load CompanyProfile Success',
  props<CompanyProfile>(),
);

export const loadCompanyProfileFailure = createAction(
  '[CompanyProfile] Load CompanyProfile Failure',
);

export const saveCompanyProfile = createAction(
  '[CompanyProfile] Save CompanyProfile',
  props<{saveData: SaveCompanyProfileData}>(),
);

export const saveCompanyProfileSuccess = createAction(
  '[CompanyProfile] Save CompanyProfile Success',
  props<CompanyProfile>(),
);

export const saveCompanyProfileFailure = createAction(
  '[CompanyProfile] Save CompanyProfile Failure',
);

export const downloadDocument = createAction(
  '[CompanyProfile] Download Document',
  props<{ document: Document }>(),
);

export const terminateRelationship = createAction(
  '[CompanyProfile] Terminate Relationship',
);


export const terminateRelationshipConfirm = createAction(
  '[CompanyProfile] Terminate Relationship',
);

export const terminateRelationshipSuccess = createAction(
  '[CompanyProfile] Terminate Relationship Success',
);

export const terminateRelationshipFailure = createAction(
  '[CompanyProfile] Terminate Relationship Failure',
);
