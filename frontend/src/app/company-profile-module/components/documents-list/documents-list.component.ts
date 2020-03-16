import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CompanyProfileFacade } from '../../state/company-profile.facade';
import { Document } from '../../model/document.model';
import { NewDocumentsFacade } from '../../state/new-documents/new-documents.facade';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { isNewDocument, NewDocument } from '../../model/new-document.model';
import { RemovedDocumentsFacade } from '../../state/removed-documents/removed-documents.facade';
import { ConfigFacade } from '../../../state/config/config.facade';
import { LocalisationService } from 'src/app/services/localisation.service';

@Component({
  selector: 'pp-documents-list',
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.scss'],
})
export class DocumentsListComponent implements OnDestroy {
  @Output() public documentsListChange = new EventEmitter<boolean>();
  public documents: (Document | NewDocument)[];

  constructor(
    private companyProfileFacade: CompanyProfileFacade,
    private newDocumentsFacade: NewDocumentsFacade,
    public removedDocumentsFacade: RemovedDocumentsFacade,
    public configFacade: ConfigFacade,
    private localisationService: LocalisationService,
  ) {
    combineLatest(
      this.companyProfileFacade.documents,
      this.newDocumentsFacade.newDocuments,
    )
      .pipe(
        map(([documents, newDocuments]) => [...documents, ...newDocuments]),
      ).subscribe(docs => {
        this.documents = docs;
      });
  }

  public downloadDocument(document: Document | NewDocument, event: Event) {
    if (!isNewDocument(document)) {
      this.companyProfileFacade.downloadDocument(document);
      event.stopPropagation();
    }
  }

  public formatDate(sDate: string) {
    if (sDate) {
      return (new Date(sDate)).toLocaleDateString(
        this.localisationService.getInitialLocalisation().code);
    }
    return 'N/A';
  }

  public addDocument(file: File) {
    this.newDocumentsFacade.addDocument(file);
    this.documentsListChange.emit(true);
  }

  public deleteDocument(document: Document | NewDocument, event?: Event) {
    if (isNewDocument(document)) {
      this.newDocumentsFacade.removeDocument(document);
    } else {
      this.removedDocumentsFacade.markDocumentForRemoval(document);
    }

    if (event) {
      event.stopPropagation();
    }
    this.documentsListChange.emit(true);
  }

  public undoDocumentDelete(document: Document, event?: Event) {
    this.removedDocumentsFacade.unmarkDocumentForRemoval(document);

    if (event) {
      event.stopPropagation();
    }
  }

  public isDownloadable(document: Document | NewDocument): boolean {
    return !isNewDocument(document);
  }

  public onUploadError({ error }: { error: string }): void {
    this.newDocumentsFacade.reportError(error);
  }

  public ngOnDestroy() {
    this.documents.forEach((doc: Document) => {
      if (isNewDocument(doc)) {
        this.newDocumentsFacade.removeDocument(doc);
      } else {
        this.removedDocumentsFacade.isDocumentMarkedForRemoval(doc).subscribe((isMarked: boolean) => {
          if (isMarked) {
            this.removedDocumentsFacade.unmarkDocumentForRemoval(doc);
          }
        });
      }
    });
  }
}
