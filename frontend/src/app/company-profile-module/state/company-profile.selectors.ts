import { createSelector } from '@ngrx/store';
import { documentsAdapter } from './company-profile.reducer';
import { selectCompanyProfileFeature } from './feature.selectors';

export const selectProfileState = createSelector(
  selectCompanyProfileFeature,
  state => state.companyDetails,
);

export const selectCompanyDetails = createSelector(
  selectProfileState,
  state => state.companyDetails,
);

export const selectIsSaving = createSelector(
  selectProfileState,
  state => state.isSaving,
);

export const selectIsLoading = createSelector(
  selectProfileState,
  state => state.isLoading,
);

export const selectName = createSelector(
  selectProfileState,
  state => state.companyDetails.name,
);

export const selectIsProfileLoaded = createSelector(
  selectProfileState,
  state => !!state.companyDetails.name,
);

export const selectDocuments = createSelector(
  selectProfileState,
  documentsAdapter.getSelectors().selectAll,
);
