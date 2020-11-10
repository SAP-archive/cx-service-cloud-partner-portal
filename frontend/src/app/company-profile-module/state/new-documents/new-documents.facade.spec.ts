import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { RecursivePartial } from '../../../utils/recursive-partial';
import { initialState, State } from './new-documents.reducer';
import { NewDocumentsFacade } from './new-documents.facade';
import * as NewDocumentsActions from './new-documents.actions';
import { companyProfileFeatureKey, CompanyProfileFeatureState } from '../feature.selectors';
import { exampleNewDocument } from '../../model/new-document.model';
import { FileReaderService } from '../../../file-uploader/services/file-reader.service';
import { of } from 'rxjs';
import * as ReportingActions from '../../../state/reporting/reporting.actions';
import { emptyApprovalDecision } from '../../../model/approval-decision';
import SpyObj = jasmine.SpyObj;

describe('NewDocumentsFacade', () => {
  type MockedState = RecursivePartial<{ [companyProfileFeatureKey]: CompanyProfileFeatureState }>;
  let store: MockStore<MockedState>;
  let facade: NewDocumentsFacade;

  const getState = (newDocumentsState: RecursivePartial<State> = initialState): RecursivePartial<MockedState> => ({
    [companyProfileFeatureKey]: {newDocuments: newDocumentsState},
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NewDocumentsFacade,
        {provide: FileReaderService, useValue: jasmine.createSpyObj(['readContents'])},
        provideMockStore({
          initialState: getState(),
        }),
      ],
    });

    store = TestBed.inject(Store) as MockStore<MockedState>;
    facade = TestBed.inject(NewDocumentsFacade);
  });

  describe('documents', () => {
    it('should select new documents from state', () => {
      store.setState(getState({
        ids: [exampleNewDocument('1').id, exampleNewDocument('2').id],
        entities: {1: exampleNewDocument('1'), 2: exampleNewDocument('2')},
      }));
      expect(facade.newDocuments).toBeObservable(cold('a', {
        a: [
          exampleNewDocument('1'),
          exampleNewDocument('2'),
        ],
      }));
    });
  });

  describe('addDocument()', () => {
    it('should dispatch removeNewDocument action', () => {
      const spy = spyOn(store, 'dispatch');
      const fileReader = TestBed.inject(FileReaderService) as SpyObj<FileReaderService>;
      const fileContent = 'Secret data';
      const file = (): File => ({name: 'name.jpg', type: 'image/jpeg'} as any);
      fileReader.readContents.withArgs([file()]).and.returnValue(of(fileContent));

      facade.addDocument(file());

      expect(spy).toHaveBeenCalled();
      const argument = spy.calls.first().args[0] as any;
      expect(argument.type).toEqual(NewDocumentsActions.addNewDocument.type);
      expect(argument.document.name).toEqual(file().name);
      expect(argument.document.approvalDecision).toEqual(emptyApprovalDecision());
      expect(argument.document.fileContent).toEqual(fileContent);
      expect(argument.document.contentType).toEqual(file().type);
      expect(argument.document.id.length).toEqual(36);
      expect(argument.document.description).toEqual(file().name.split('.')[0]);
    });
  });

  describe('removeDocument()', () => {
    it('should dispatch removeNewDocument action', () => {
      const spy = spyOn(store, 'dispatch');
      facade.removeDocument(exampleNewDocument());
      expect(spy).toHaveBeenCalledWith(NewDocumentsActions.removeNewDocument({document: exampleNewDocument()}));
    });
  });

  describe('reportError()', () => {
    it('should dispatch ReportingActions.reportError action', () => {
      const spy = spyOn(store, 'dispatch');
      const message = 'some error';
      facade.reportError(message);
      expect(spy).toHaveBeenCalledWith(ReportingActions.reportError({message}));
    });
  });
});
