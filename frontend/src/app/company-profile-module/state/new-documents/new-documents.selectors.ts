import { createSelector } from '@ngrx/store';
import { newDocumentsAdapter } from './new-documents.reducer';
import { selectCompanyProfileFeature } from '../feature.selectors';

export const selectNewDocumentsState = createSelector(
  selectCompanyProfileFeature,
  state => state.newDocuments,
);

export const selectNewDocuments = createSelector(
  selectNewDocumentsState,
  newDocumentsAdapter.getSelectors().selectAll,
);
