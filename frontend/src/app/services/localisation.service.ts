import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../state';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorage } from 'ngx-store';
import { findLocalisation } from '../components/localisation-selector/localisations';
import { Localisation } from '../components/localisation-selector/localisation';
import { Observable, of } from 'rxjs';
import { AppBackendService } from './app-backend.service';
import { AuthFacade } from '../auth-module/state/auth.facade';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocalisationService {
  @LocalStorage() public localisation: Localisation;

  constructor(private store: Store<fromRoot.RootState>,
              private translateService: TranslateService,
              private appBackendService: AppBackendService,
              private authFacade: AuthFacade) {
    this.translateService.setDefaultLang('en');
  }

  public getInitialLocalisation(): Localisation {
    return this.localisation ? this.localisation : findLocalisation(this.translateService.getBrowserLang());
  }

  public setLocalisation(localisation: Localisation | undefined): Observable<{ data: string, version: number }[]> {
    if (!localisation) {
      return of([]);
    }

    this.localisation = localisation;
    this.translateService.use(localisation.language);

    return this.authFacade.isLoggedIn.pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.appBackendService.post<{ data: string, version: number }[]>(`/setLocalisation`, {code: localisation.code, language: localisation.language})
            .pipe(map(response => response.body));
        } else {
          return of([]);
        }
      }),
    );
  }

  public translate(key: string): Observable<string> {
    return this.translateService.get(key);
  }
}
