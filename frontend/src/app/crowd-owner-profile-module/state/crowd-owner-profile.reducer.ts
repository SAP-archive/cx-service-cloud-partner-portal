import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as crowdOwnerProfileActions from './crowd-owner-profile.actions';
import { ContactDetails, emptyContactDetails } from '../model/contact-details';

export interface State extends EntityState<Document> {
  isLoadingContact: boolean;
  contactDetails: ContactDetails;
  isLoadingLogo: boolean;
  companyLogo: string;
  crowdName: string;
  isLoadingCrowName: boolean;
}

export const documentsAdapter: EntityAdapter<Document> = createEntityAdapter<Document>();

export const initialState: State = documentsAdapter.getInitialState({
  isLoadingContact: false,
  contactDetails: emptyContactDetails(),
  isLoadingLogo: false,
  companyLogo: null,
  crowdName: null,
  isLoadingCrowName: false,
});

const crowdOwnerProfileReducer = createReducer(
  initialState,

  on(crowdOwnerProfileActions.loadCompanyContact, state => ({...state, isLoadingContact: true})),

  on(crowdOwnerProfileActions.loadCompanyContactSuccess, (state, {contactDetails}) => ({
      ...state,
      isLoadingContact: false,
      contactDetails,
    })),

  on(crowdOwnerProfileActions.loadCompanyContactFailure, state => ({...state, isLoadingContact: false})),

  on(crowdOwnerProfileActions.loadCompanyLogo, state => ({...state, isLoadingLogo: true})),
  on(crowdOwnerProfileActions.loadCompanyLogoFailure, state => ({...state, isLoadingLogo: false})),
  on(crowdOwnerProfileActions.loadCompanyLogoSuccess, (state, {companyLogo}) => ({
      ...state,
      isLoadingLogo: false,
      companyLogo,
    })),
  on(crowdOwnerProfileActions.loadCrowdName, state => ({...state, isLoadingCrowName: true})),
  on(crowdOwnerProfileActions.loadCrowdNameFailure, state => ({...state, isLoadingCrowName: false})),
  on(crowdOwnerProfileActions.loadCrowdNameSuccess, (state, {crowdName}) => ({
      ...state,
      isLoadingCrowName: false,
      crowdName,
    })),
);

export function reducer(state: State | undefined, action: Action) {
  return crowdOwnerProfileReducer(state, action);
}
