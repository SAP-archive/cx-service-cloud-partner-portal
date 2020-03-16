import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { RecursivePartial } from '../../../utils/recursive-partial';
import { initialState, State } from './removed-documents.reducer';
import { RemovedDocumentsFacade } from './removed-documents.facade';
import * as RemovedDocumentsActions from './removed-documents.actions';
import { companyProfileFeatureKey, CompanyProfileFeatureState } from '../feature.selectors';
import { exampleDocument } from '../../model/document.model';

describe('RemovedDocumentsFacade', () => {
  type MockedState = RecursivePartial<{ [companyProfileFeatureKey]: CompanyProfileFeatureState }>;
  let store: MockStore<MockedState>;
  let facade: RemovedDocumentsFacade;

  const getState = (removedDocumentsState: RecursivePartial<State> = initialState): RecursivePartial<MockedState> => ({
    [companyProfileFeatureKey]: {removedDocuments: removedDocumentsState},
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RemovedDocumentsFacade,
        provideMockStore({
          initialState: getState(),
        }),
      ],
    });

    store = TestBed.get(Store);
    facade = TestBed.get(RemovedDocumentsFacade);
  });

  describe('removedDocumentsIds', () => {
    it('should select removedDocumentsIds from state', () => {
      store.setState(getState({
        ids: [exampleDocument('1').id, exampleDocument('2').id],
        entities: {1: exampleDocument('1'), 2: exampleDocument('2')},
      }));
      expect(facade.removedDocumentsIds).toBeObservable(cold('a', {
        a: ['1', '2'],
      }));
    });
  });

  describe('removedDocumentsEntities', () => {
    it('should select removedDocumentsEntities from state', () => {
      store.setState(getState({
        ids: [exampleDocument('1').id, exampleDocument('2').id],
        entities: {1: exampleDocument('1'), 2: exampleDocument('2')},
      }));
      expect(facade.removedDocumentsEntities).toBeObservable(cold('a', {
        a: {'1': exampleDocument('1'), '2': exampleDocument('2')},
      }));
    });
  });

  describe('isDocumentMarkedForRemoval()', () => {
    it('should check if document is marked for removal', () => {
      store.setState(getState({
        ids: [exampleDocument('1').id],
        entities: {1: exampleDocument('1')},
      }));

      expect(facade.isDocumentMarkedForRemoval(exampleDocument('1'))).toBeObservable(hot('(a|)', {a: true}));
      expect(facade.isDocumentMarkedForRemoval(exampleDocument('2'))).toBeObservable(cold('(a|)', {a: false}));
    });
  });

  describe('markDocumentForRemoval()', () => {
    it('should dispatch markDocumentForRemoval action', () => {
      const spy = spyOn(store, 'dispatch');
      facade.markDocumentForRemoval(exampleDocument());
      expect(spy).toHaveBeenCalledWith(RemovedDocumentsActions.markDocumentForRemoval({document: exampleDocument()}));
    });
  });

  describe('unmarkDocumentForRemoval()', () => {
    it('should dispatch unmarkDocumentForRemoval action', () => {
      const spy = spyOn(store, 'dispatch');
      facade.unmarkDocumentForRemoval(exampleDocument());
      expect(spy).toHaveBeenCalledWith(RemovedDocumentsActions.unmarkDocumentForRemoval({document: exampleDocument()}));
    });
  });
});
