import { Injectable } from '@angular/core';
import { CompanyProfileModule } from '../company-profile.module';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CompanyProfileFacade } from '../state/company-profile.facade';
import { CompanyDetails } from '../model/company-profile.model';
import { take } from 'rxjs/operators';

@Injectable({providedIn: CompanyProfileModule})
export class CompanyProfileResolver implements Resolve<CompanyDetails> {
  constructor(private companyProfileFacade: CompanyProfileFacade) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CompanyDetails> {
    this.companyProfileFacade.loadCompanyProfileIfNotLoadedAlready();
    return this.companyProfileFacade.companyDetails.pipe(take(1));
  }
}
