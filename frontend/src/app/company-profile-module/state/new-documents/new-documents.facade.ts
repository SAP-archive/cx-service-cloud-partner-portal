import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../../state';
import { selectNewDocuments } from './new-documents.selectors';
import * as NewDocumentsActions from './new-documents.actions';
import * as ReportingActions from '../../../state/reporting/reporting.actions';
import * as uuid from 'uuid';
import { NewDocument } from '../../model/new-document.model';
import { FileReaderService } from '../../../file-uploader/services/file-reader.service';
import { take } from 'rxjs/operators';
import { emptyApprovalDecision } from '../../../model/approval-decision';

@Injectable()
export class NewDocumentsFacade {
  public newDocuments = this.store.select(selectNewDocuments);

  constructor(private store: Store<RootState>,
              private fileReaderService: FileReaderService) {
  }

  public addDocument(file: File): void {
    this.fileReaderService.readContents([file])
      .pipe(take(1))
      .subscribe(fileContent => this.store.dispatch(NewDocumentsActions.addNewDocument({
        document: {
          id: uuid(),
          name: file.name,
          approvalDecision: emptyApprovalDecision(),
          fileContent,
          contentType: file.type,
          description: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
        },
      })));
  }

  public removeDocument(document: NewDocument): void {
    this.store.dispatch(NewDocumentsActions.removeNewDocument({document}));
  }

  public reportError(message: string) {
    this.store.dispatch(ReportingActions.reportError({message}));
  }
}
