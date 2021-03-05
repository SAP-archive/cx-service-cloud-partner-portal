import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfigFacade } from '../state/config/config.facade';

@Injectable()
export class CompanySettingsResolver implements Resolve<boolean> {
  constructor(private configFacade: ConfigFacade) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.configFacade.fetchCompanySettingsIfNotLoadedYet();
    return this.configFacade.selectAreCompanySettingsLoaded.pipe(take(1));
  }
}
