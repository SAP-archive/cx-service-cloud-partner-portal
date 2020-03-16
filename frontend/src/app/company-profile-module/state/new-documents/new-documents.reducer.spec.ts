import { initialState, newDocumentsAdapter, reducer } from './new-documents.reducer';
import * as NewDocumentsActions from './new-documents.actions';
import * as CompanyProfileActions from '../company-profile.actions';
import { exampleNewDocument } from '../../model/new-document.model';

describe('NewDocuments Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('on addNewDocument', () => {
    it('should add a new document', () => {
      const result = reducer(initialState, NewDocumentsActions.addNewDocument({document: exampleNewDocument()}));

      expect(newDocumentsAdapter.getSelectors().selectAll(result)).toEqual([exampleNewDocument()]);
    });
  });

  describe('on removeNewDocument', () => {
    it('should remove the document', () => {
      const result = reducer(
        {
          ...initialState,
          ids: [
            exampleNewDocument('1').id,
            exampleNewDocument('2').id,
          ],
          entities: {
            [exampleNewDocument('1').id]: exampleNewDocument('1'),
            [exampleNewDocument('2').id]: exampleNewDocument('2'),
          },
        },
        NewDocumentsActions.removeNewDocument({document: exampleNewDocument('1')}),
      );

      expect(newDocumentsAdapter.getSelectors().selectAll(result)).toEqual([exampleNewDocument('2')]);
    });
  });

  describe('on CompanyProfileActions.saveCompanyProfileSuccess', () => {
    it('should reset the state to initial one', () => {
      const result = reducer(
        {
          ...initialState,
          ids: [
            exampleNewDocument('1').id,
          ],
          entities: {
            [exampleNewDocument('1').id]: exampleNewDocument('1'),
          },
        },
        CompanyProfileActions.saveCompanyProfileSuccess(null),
      );

      expect(result).toEqual(initialState);
    });
  });
});
