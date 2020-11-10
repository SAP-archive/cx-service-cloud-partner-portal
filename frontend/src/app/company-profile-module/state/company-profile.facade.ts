import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../state';
import { selectCompanyDetails, selectDocuments, selectIsProfileLoaded, selectIsSaving, selectIsLoading, selectName } from './company-profile.selectors';
import { take } from 'rxjs/operators';
import * as CompanyProfileActions from './company-profile.actions';
import { Document } from '../model/document.model';
import { SaveCompanyProfileData } from '../model/save-company-profile-data';

@Injectable()
export class CompanyProfileFacade {
  public companyDetails = this.store.select(selectCompanyDetails);
  public isSaving = this.store.select(selectIsSaving);
  public isLoading = this.store.select(selectIsLoading);
  public name = this.store.select(selectName);
  public isProfileLoaded = this.store.select(selectIsProfileLoaded);
  public documents = this.store.select(selectDocuments);

  constructor(private store: Store<RootState>) {
  }

  public loadCompanyProfileIfNotLoadedAlready() {
    this.isProfileLoaded.pipe(
      take(1),
    ).subscribe(isProfileLoaded => {
      if (!isProfileLoaded) {
        this.loadCompanyProfile();
      }
    });
  }

  public loadCompanyProfile() {
    this.store.dispatch(CompanyProfileActions.loadCompanyProfile());
  }

  public saveCompanyProfile(saveData: SaveCompanyProfileData) {
    this.store.dispatch(CompanyProfileActions.saveCompanyProfile({saveData}));
  }

  public downloadDocument(document: Document) {
    this.store.dispatch(CompanyProfileActions.downloadDocument({document}));
  }

  public terminateRelationship() {
    this.store.dispatch(CompanyProfileActions.terminateRelationship());
  }

}
