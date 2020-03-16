import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../../state';
import { CompanyProfileModule } from '../../company-profile.module';
import { selectRemovedDocumentsIds, selectRemovedDocumentsEntities } from './removed-documents.selectors';
import * as RemovedDocumentsActions from './removed-documents.actions';
import { Document } from '../../model/document.model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({providedIn: CompanyProfileModule})
export class RemovedDocumentsFacade {
  public removedDocumentsIds = this.store.select(selectRemovedDocumentsIds) as Observable<string[]>;
  public removedDocumentsEntities = this.store.select(selectRemovedDocumentsEntities);

  constructor(private store: Store<RootState>) {
  }

  public isDocumentMarkedForRemoval(document: Document): Observable<boolean> {
    return this.removedDocumentsEntities.pipe(
      take(1),
      map(entities => !!entities[document.id]),
    );
  }

  public markDocumentForRemoval(document: Document): void {
    this.store.dispatch(RemovedDocumentsActions.markDocumentForRemoval({document}));
  }

  public unmarkDocumentForRemoval(document: Document): void {
    this.store.dispatch(RemovedDocumentsActions.unmarkDocumentForRemoval({document}));
  }
}
