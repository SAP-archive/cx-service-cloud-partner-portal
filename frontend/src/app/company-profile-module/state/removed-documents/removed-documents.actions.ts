import { createAction, props } from '@ngrx/store';
import { Document } from '../../model/document.model';

export const markDocumentForRemoval = createAction(
  '[RemovedDocuments] Mark Document For Removal',
  props<{ document: Document }>(),
);

export const unmarkDocumentForRemoval = createAction(
  '[RemovedDocuments] Unmark Document For Removal',
  props<{ document: Document }>(),
);
