import { initialState, removedDocumentsAdapter, reducer } from './removed-documents.reducer';
import * as RemovedDocumentsActions from './removed-documents.actions';
import * as CompanyProfileActions from '../company-profile.actions';
import { exampleDocument } from '../../model/document.model';

describe('RemovedDocuments Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('on markDocumentForRemoval', () => {
    it('should mark a document for removal', () => {
      const result = reducer(initialState, RemovedDocumentsActions.markDocumentForRemoval({document: exampleDocument()}));

      expect(removedDocumentsAdapter.getSelectors().selectAll(result)).toEqual([exampleDocument()]);
    });
  });

  describe('on unmarkDocumentForRemoval', () => {
    it('should unmark the document for removal', () => {
      const result = reducer(
        {
          ...initialState,
          ids: [
            exampleDocument('1').id,
            exampleDocument('2').id,
          ],
          entities: {
            [exampleDocument('1').id]: exampleDocument('1'),
            [exampleDocument('2').id]: exampleDocument('2'),
          },
        },
        RemovedDocumentsActions.unmarkDocumentForRemoval({document: exampleDocument('1')}),
      );

      expect(removedDocumentsAdapter.getSelectors().selectAll(result)).toEqual([exampleDocument('2')]);
    });
  });

  describe('on CompanyProfileActions.saveCompanyProfileSuccess', () => {
    it('should reset the state to initial one', () => {
      const result = reducer(
        {
          ...initialState,
          ids: [
            exampleDocument('1').id,
          ],
          entities: {
            [exampleDocument('1').id]: exampleDocument('1'),
          },
        },
        CompanyProfileActions.saveCompanyProfileSuccess(null),
      );

      expect(result).toEqual(initialState);
    });
  });
});
