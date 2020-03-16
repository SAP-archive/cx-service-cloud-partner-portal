import { DocumentsListComponent } from './documents-list.component';
import { exampleDocument } from '../../model/document.model';
import { exampleNewDocument } from '../../model/new-document.model';
import { RemovedDocumentsFacadeMockBuilder } from '../../state/removed-documents/removed-documents-facade.mock.spec';
import { of } from 'rxjs';

describe('DocumentsListComponent', () => {
  const domEvent = {
    stopPropagation: jasmine.createSpy(),
  };
  let removedDocumentsFacade = new RemovedDocumentsFacadeMockBuilder().build();
  let component: DocumentsListComponent;
  let companyProfileFacade: any;
  let newDocumentsFacade: any;
  let localisationService: any;

  beforeEach(() => {
    companyProfileFacade = {
      documents: of([exampleDocument()]),
      downloadDocument: jasmine.createSpy(),
      loadCompanyProfileIfNotLoadedAlready: jasmine.createSpy(),
      loadCompanyProfile: jasmine.createSpy(),
      saveCompanyProfile: jasmine.createSpy(),
    };

    newDocumentsFacade = {
      newDocuments: of([exampleNewDocument()]),
      addDocument: jasmine.createSpy(),
      removeDocument: jasmine.createSpy(),
      reportError: jasmine.createSpy(),
    };

    removedDocumentsFacade = new RemovedDocumentsFacadeMockBuilder().build();

    removedDocumentsFacade.isDocumentMarkedForRemoval.and.returnValue(of(true));

    localisationService = { getInitialLocalisation: () => 'en-gb' };

    component = new DocumentsListComponent(
      companyProfileFacade as any,
      newDocumentsFacade as any,
      removedDocumentsFacade,
      null,
      localisationService,
    );
  });

  it('should combine and share the documents coming from both facades', () => {
    const docs = [exampleDocument(), exampleNewDocument()];
    setTimeout(() => {
      expect(component.documents).toEqual(docs);
    });
  });

  describe('downloadDocument()', () => {
    it('should download the passed document', () => {
      component.downloadDocument(exampleDocument(), new Event('click'));
      expect(companyProfileFacade.downloadDocument).toHaveBeenCalledWith(exampleDocument());
    });

    it('should stop propagation of the event', () => {
      component.downloadDocument(exampleDocument(), domEvent as any);
      expect(domEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('deleteDocument', () => {
    describe('if event is passed', () => {
      it('should stop propagation', () => {
        component.deleteDocument(exampleDocument(), domEvent as any);
        expect(domEvent.stopPropagation).toHaveBeenCalled();
      });
    });

    describe('if document is new', () => {
      it('should remove document on using newDocumentsFacade', () => {
        component.deleteDocument(exampleNewDocument());
        expect(newDocumentsFacade.removeDocument).toHaveBeenCalledWith(exampleNewDocument());
      });
    });

    describe('if document is not new', () => {
      it('should mark document for removal using removedDocumentsFacade', () => {
        component.deleteDocument(exampleDocument());
        expect(removedDocumentsFacade.markDocumentForRemoval).toHaveBeenCalledWith(exampleDocument());
      });
    });
  });

  describe('undoDocumentDelete()', () => {
    describe('if event is passed', () => {
      it('should stop propagation', () => {
        component.undoDocumentDelete(exampleDocument(), domEvent as any);
        expect(domEvent.stopPropagation).toHaveBeenCalled();
      });
    });

    it('should unmark document for removal using removedDocumentsFacade', () => {
      component.undoDocumentDelete(exampleDocument());
      expect(removedDocumentsFacade.unmarkDocumentForRemoval).toHaveBeenCalledWith(exampleDocument());
    });
  });

  describe('isDownloadable()', () => {
    it('should return true only for old documents', () => {
      expect(component.isDownloadable(exampleDocument())).toBeTrue();
      expect(component.isDownloadable(exampleNewDocument())).toBeFalse();
    });
  });

  describe('formatDate()', () => {
    it('should return N/A', () => {
      expect(component.formatDate(null) === 'N/A').toBeTrue();
    });
  });

  describe('formatDate()', () => {
    it('should return Invalid Date', () => {
      expect(component.formatDate('test date string') === 'Invalid Date').toBeTrue();
    });
  });

  describe('formatDate()', () => {
    it('should return valid date string', () => {
      expect(component.formatDate('2020-12-01') === '12/1/2020').toBeTrue();
    });
  });

  describe('addDocument()', () => {
    it('should add document using facade', () => {
      const file = (): File => ({ what: 'ever' } as any);
      component.addDocument(file());
      expect(newDocumentsFacade.addDocument).toHaveBeenCalledWith(file());
    });
  });

  describe('onUploadError()', () => {
    it('should report error using facade', () => {
      const message = 'some error';
      component.onUploadError({ error: message });
      expect(newDocumentsFacade.reportError).toHaveBeenCalledWith(message);
    });
  });

  describe('onDestroy()', () => {
    it('should unmark document for removal', () => {
      component.ngOnDestroy();
      expect(removedDocumentsFacade.unmarkDocumentForRemoval).toHaveBeenCalled;
    });

    it('should remove unsaved new documents', () => {
      component.ngOnDestroy();
      expect(newDocumentsFacade.removeDocument).toHaveBeenCalled();
    });
  });
});
