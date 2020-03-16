import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as RemovedDocumentsActions from './removed-documents.actions';
import * as CompanyProfileActions from '../company-profile.actions';
import { Document } from '../../model/document.model';

export interface State extends EntityState<Document> {
}

export const removedDocumentsAdapter: EntityAdapter<Document> = createEntityAdapter<Document>();

export const initialState: State = removedDocumentsAdapter.getInitialState({});

const companyProfileReducer = createReducer(
  initialState,

  on(
    RemovedDocumentsActions.markDocumentForRemoval,
    (state, {document}) => removedDocumentsAdapter.addOne(document, state),
  ),

  on(
    RemovedDocumentsActions.unmarkDocumentForRemoval,
    (state, {document}) => removedDocumentsAdapter.removeOne(document.id, state),
  ),

  on(
    CompanyProfileActions.saveCompanyProfileSuccess,
    () => initialState,
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return companyProfileReducer(state, action);
}
