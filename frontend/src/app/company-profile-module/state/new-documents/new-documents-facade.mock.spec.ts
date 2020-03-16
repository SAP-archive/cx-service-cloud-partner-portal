import { of } from 'rxjs';
import { NewDocumentsFacade } from './new-documents.facade';
import { exampleNewDocument } from '../../model/new-document.model';
import SpyObj = jasmine.SpyObj;

export class NewDocumentsFacadeMockBuilder {
  private mock = jasmine.createSpyObj<NewDocumentsFacade>([
    'addDocument',
    'removeDocument',
    'reportError',
  ]);

  constructor() {
    this.mock.newDocuments = of([exampleNewDocument()]);
  }

  public build(): SpyObj<NewDocumentsFacade> {
    return this.mock;
  }

  public setNewDocuments(newDocuments: any) {
    this.mock.newDocuments = newDocuments;
    return this;
  }
}
