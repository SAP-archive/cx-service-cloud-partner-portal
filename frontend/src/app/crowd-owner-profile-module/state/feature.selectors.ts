import { createFeatureSelector } from '@ngrx/store';
import * as fromCrowdOwnerProfile from './crowd-owner-profile.reducer';

export const crowdOwnerProfileFeatureKey = 'crowdOwnerProfile';

export interface CrowdOwnerProfileFeatureState {
  companyProfile: fromCrowdOwnerProfile.State;
}

export const selectCrowdOwnerProfileFeature = createFeatureSelector<CrowdOwnerProfileFeatureState>(
  crowdOwnerProfileFeatureKey,
);
