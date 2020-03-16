import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as CompanyProfileActions from './company-profile.actions';
import { CompanyDetails, emptyCompanyDetails } from '../model/company-profile.model';
import { Document } from '../model/document.model';

export interface State extends EntityState<Document> {
  isLoading: boolean;
  isSaving: boolean;
  companyDetails: CompanyDetails;
}

export const documentsAdapter: EntityAdapter<Document> = createEntityAdapter<Document>();

export const initialState: State = documentsAdapter.getInitialState({
  isLoading: false,
  isSaving: false,
  companyDetails: emptyCompanyDetails(),
});

const companyProfileReducer = createReducer(
  initialState,

  on(CompanyProfileActions.loadCompanyProfile, state => ({...state, isLoading: true})),

  on(
    CompanyProfileActions.loadCompanyProfileSuccess,
    (state, {companyDetails, documents}) =>
      documentsAdapter.addAll(documents, {...state, isLoading: false, companyDetails: companyDetails}),
  ),

  on(CompanyProfileActions.loadCompanyProfileFailure, state => ({...state, isLoading: false})),

  on(CompanyProfileActions.saveCompanyProfile, state => ({...state, isSaving: true})),

  on(
    CompanyProfileActions.saveCompanyProfileSuccess,
    (state, {companyDetails, documents}) =>
      documentsAdapter.addAll(
        documents,
        {
          ...state,
          isSaving: false,
          companyDetails: {...state.companyDetails, ...companyDetails},
        },
      ),
  ),

  on(CompanyProfileActions.saveCompanyProfileFailure, state => ({...state, isSaving: false})),
);

export function reducer(state: State | undefined, action: Action) {
  return companyProfileReducer(state, action);
}
