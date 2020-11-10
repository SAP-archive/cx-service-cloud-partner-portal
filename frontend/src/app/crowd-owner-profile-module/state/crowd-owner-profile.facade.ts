import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../state';
import * as CompanyProfileActions from './crowd-owner-profile.actions';
import { selectCompanyLogo, selectContactDetails, selectIsLoading, selectCrowdName } from './crowd-owner-profile.selectors';
import { map } from 'rxjs/operators';

@Injectable()
export class CrowdOwnerProfileFacade {
  public companyLogo = this.store.select(selectCompanyLogo);
  public crowdName = this.store.select(selectCrowdName);
  public hasLogoAvailable = this.store.select(selectCompanyLogo).pipe(map(value => !!value));
  public contactDetails = this.store.select(selectContactDetails);
  public isLoading = this.store.select(selectIsLoading);

  constructor(private store: Store<RootState>) {
  }

  public loadContactInfo() {
    this.store.dispatch(CompanyProfileActions.loadCompanyContact());
  }

  public loadCompanyLogo() {
    this.store.dispatch(CompanyProfileActions.loadCompanyLogo());
  }

  public loadCrowdName() {
    this.store.dispatch(CompanyProfileActions.loadCrowdName());
  }
}
