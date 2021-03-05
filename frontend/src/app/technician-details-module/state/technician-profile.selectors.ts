import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTechnicianProfile from './technician-profile.reducer';
import { skillViewModelsAdapter } from './technician-profile.reducer';

export const selectTechnicianProfileState = createFeatureSelector<fromTechnicianProfile.State>(
  fromTechnicianProfile.technicianProfileFeatureKey,
);

export const selectProfileData = createSelector(
  selectTechnicianProfileState,
  state => state.profileData,
);

export const selectIsLoading = createSelector(
  selectTechnicianProfileState,
  state => state.isLoadingProfile || state.isLoadingSkills || state.isLoadingTags,
);

export const selectIsAwaitingNavigationChange = createSelector(
  selectTechnicianProfileState,
  state => state.isAwaitingNavigationChange,
);

export const selectSkillViewModels = createSelector(
  selectTechnicianProfileState,
  state => skillViewModelsAdapter.getSelectors()
    .selectAll(state.skillViewModels)
    .filter(skillViewModel => skillViewModel.tag && skillViewModel.tag.externalId),
);
