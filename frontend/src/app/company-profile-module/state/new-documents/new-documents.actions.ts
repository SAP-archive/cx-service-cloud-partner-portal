import { createAction, props } from '@ngrx/store';
import { NewDocument } from '../../model/new-document.model';

export const addNewDocument = createAction(
  '[NewDocuments] Add New Document',
  props<{document: NewDocument}>(),
);

export const removeNewDocument = createAction(
  '[NewDocuments] Remove New Document',
  props<{document: NewDocument}>(),
);
