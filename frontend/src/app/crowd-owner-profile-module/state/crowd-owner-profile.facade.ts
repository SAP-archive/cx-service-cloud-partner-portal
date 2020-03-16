import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../state';
import * as CompanyProfileActions from './crowd-owner-profile.actions';
import { selectContactDetails, selectIsLoading, selectCompanyLogo } from './crowd-owner-profile.selectors';
import { CrowdOwnerProfileModule } from '../crowd-owner-profile.module';
import { map } from 'rxjs/operators';

@Injectable({providedIn: CrowdOwnerProfileModule})
export class CrowdOwnerProfileFacade {
  public companyLogo = this.store.select(selectCompanyLogo);
  public hasLogoAvailable = this.store.select(selectCompanyLogo).pipe(map(value => !!value));
  public contactDetails = this.store.select(selectContactDetails);
  public isLoading = this.store.select(selectIsLoading);

  constructor(private store: Store<RootState>) {}

  public loadContactInfo() {
    this.store.dispatch(CompanyProfileActions.loadCompanyContact());
  }

  public loadCompanyLogo() {
    this.store.dispatch(CompanyProfileActions.loadCompanyLogo());
  }
}
