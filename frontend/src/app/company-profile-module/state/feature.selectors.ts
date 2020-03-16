import { createFeatureSelector } from '@ngrx/store';
import * as fromCompanyProfile from './company-profile.reducer';
import * as fromNewDocuments from './new-documents/new-documents.reducer';
import * as fromRemovedDocuments from './removed-documents/removed-documents.reducer';

export const companyProfileFeatureKey = 'companyProfile';

export interface CompanyProfileFeatureState {
  companyDetails: fromCompanyProfile.State;
  newDocuments: fromNewDocuments.State;
  removedDocuments: fromRemovedDocuments.State;
}

export const selectCompanyProfileFeature = createFeatureSelector<CompanyProfileFeatureState>(
  companyProfileFeatureKey,
);
