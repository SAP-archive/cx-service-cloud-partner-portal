import { createSelector } from '@ngrx/store';
import { removedDocumentsAdapter } from './removed-documents.reducer';
import { selectCompanyProfileFeature } from '../feature.selectors';

export const selectRemovedDocumentsState = createSelector(
  selectCompanyProfileFeature,
  state => state.removedDocuments,
);

export const selectRemovedDocumentsIds = createSelector(
  selectRemovedDocumentsState,
  removedDocumentsAdapter.getSelectors().selectIds,
);

export const selectRemovedDocumentsEntities = createSelector(
  selectRemovedDocumentsState,
  removedDocumentsAdapter.getSelectors().selectEntities,
);
