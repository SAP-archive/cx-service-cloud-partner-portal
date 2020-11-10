import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorage } from 'ngx-store';
import { findLocalisation } from '../components/localisation-selector/localisations';
import { Localisation } from '../components/localisation-selector/localisation';
import { Observable, of, combineLatest } from 'rxjs';
import { AppBackendService } from './app-backend.service';
import { AuthFacade } from '../auth-module/state/auth/auth.facade';
import { map, switchMap, take } from 'rxjs/operators';
import * as moment from 'moment';
import { UserFacade } from '../state/user/user.facade';

@Injectable({
  providedIn: 'root',
})
export class LocalisationService {
  @LocalStorage() public localisation: Localisation;

  constructor(private translateService: TranslateService,
              private appBackendService: AppBackendService,
              private authFacade: AuthFacade,
              private userFacade: UserFacade) {
    this.translateService.setDefaultLang('en');
  }

  public getInitialLocalisation(): Localisation {
    const initialLocalisation =  this.localisation ? this.localisation : findLocalisation(this.translateService.getBrowserLang());
    moment.locale(initialLocalisation.language);
    return initialLocalisation;
  }

  public selectLocalisation(localisation: Localisation | undefined): Observable<{ data: string, version: number }[]> {
    if (!localisation) {
      return of([]);
    }
    this.setLocalLocalisation(localisation);

    return this.authFacade.isLoggedIn.pipe(
      take(1),
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
         return this.updateLocalisation(localisation);
        } else {
          this.userFacade.setIsLocalisationChangeNeeded(true);
          return of([]);
        }
      }),
    );
  }

  public setLocalLocalisation(localisation: Localisation) {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
    this.localisation = localisation;
    localStorage.setItem('localisation', JSON.stringify(localisation));
    this.translateService.use(localisation.language);
    moment.locale(localisation.language);
    return of([]);
  }

  public setLocalisationWhenLoginSuccess(loginLocalisation: Localisation | undefined): Observable<{ data: string, version: number }[]> {
    if (!loginLocalisation) {
      return of([]);
    }

    return combineLatest([this.userFacade.currentLocalisation, this.userFacade.isLocalisationChangeNeeded]).pipe(
      take(1),
      switchMap(([ currentLocalisation, needChange ]) => {
        if (needChange) {
          return this.updateLocalisation(currentLocalisation).pipe((data) => {
            this.userFacade.setIsLocalisationChangeNeeded(false);
            return data;
          });
        } else {
          this.setLocalLocalisation(loginLocalisation);
          this.userFacade.setCurrentLocalisation(loginLocalisation);
          return of([]);
        }
      })
   );

  }

  public translate(key: string): Observable<string> {
    return this.translateService.get(key);
  }

  private updateLocalisation(localisation: Localisation): Observable<{ data: string, version: number }[]> {
    return this.appBackendService.post<{ data: string, version: number }[]>(`/setLocalisation`,
      {code: localisation.code, language: localisation.language})
      .pipe(map(response => {
          return response.body; }));
  }
}
