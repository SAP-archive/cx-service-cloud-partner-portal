import { createSelector } from '@ngrx/store';
import { selectCrowdOwnerProfileFeature } from './feature.selectors';

export const selectCrowdOwnerProfileState = createSelector(
  selectCrowdOwnerProfileFeature,
  state => state.companyProfile,
);

export const selectContactDetails = createSelector(
  selectCrowdOwnerProfileState,
  state => state.contactDetails,
);

export const selectCompanyLogo = createSelector(
  selectCrowdOwnerProfileState,
  state => state.companyLogo,
);

export const selectCrowdName = createSelector(
  selectCrowdOwnerProfileState,
  state => state.crowdName,
);

export const selectIsLoading = createSelector(
  selectCrowdOwnerProfileState,
  state => state.isLoadingContact || state.isLoadingLogo || state.isLoadingCrowName,
);
