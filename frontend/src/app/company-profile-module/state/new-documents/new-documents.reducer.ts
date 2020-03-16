import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as NewDocumentsActions from './new-documents.actions';
import * as CompanyProfileActions from '../company-profile.actions';
import { NewDocument } from '../../model/new-document.model';

export interface State extends EntityState<NewDocument> {
}

export const newDocumentsAdapter: EntityAdapter<NewDocument> = createEntityAdapter<NewDocument>();

export const initialState: State = newDocumentsAdapter.getInitialState({});

const companyProfileReducer = createReducer(
  initialState,

  on(
    NewDocumentsActions.addNewDocument,
    (state, {document}) => newDocumentsAdapter.addOne(document, state),
  ),

  on(
    NewDocumentsActions.removeNewDocument,
    (state, {document}) => newDocumentsAdapter.removeOne(document.id, state),
  ),

  on(
    CompanyProfileActions.saveCompanyProfileSuccess,
    () => initialState,
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return companyProfileReducer(state, action);
}
