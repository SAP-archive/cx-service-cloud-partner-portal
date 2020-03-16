import { of } from 'rxjs';
import { RemovedDocumentsFacade } from './removed-documents.facade';
import { exampleDocument } from '../../model/document.model';
import SpyObj = jasmine.SpyObj;

export class RemovedDocumentsFacadeMockBuilder {
  private mock = jasmine.createSpyObj<RemovedDocumentsFacade>([
    'isDocumentMarkedForRemoval',
    'markDocumentForRemoval',
    'unmarkDocumentForRemoval',
  ]);

  constructor() {
    this.mock.removedDocumentsIds = of(['1']);
    this.mock.removedDocumentsEntities = of({1: exampleDocument()});
  }

  public build(): SpyObj<RemovedDocumentsFacade> {
    return this.mock;
  }

  public setRemovedDocumentsIds(removedDocumentsIds: any) {
    this.mock.removedDocumentsIds = removedDocumentsIds;
    return this;
  }

  public setRemovedDocumentsEntities(removedDocumentsEntities: any) {
    this.mock.removedDocumentsEntities = removedDocumentsEntities;
    return this;
  }
}
