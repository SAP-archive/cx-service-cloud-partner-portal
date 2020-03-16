import { Injectable } from '@angular/core';
import { AuthModule } from '../auth.module';
import { Credentials } from '../model/credentials.model';
import { Observable } from 'rxjs';
import { LoginData } from '../model/login-data.model';
import { Router } from '@angular/router';
import { AuthFacade } from '../state/auth.facade';
import { map, switchMap, take } from 'rxjs/operators';
import { AppBackendService } from '../../services/app-backend.service';
import { findLocalisation } from '../../components/localisation-selector/localisations';
import { AuthData } from '../model/auth-data.model';
import { UnifiedPerson } from '../../model/unified-person.model';
import { Localisation } from '../../components/localisation-selector/localisation';

@Injectable({providedIn: AuthModule})
export class AuthService {
  constructor(private router: Router,
              private authFacade: AuthFacade,
              private appBackendService: AppBackendService) {
  }

  public login(credentials: Credentials): Observable<LoginData> {
    return this.appBackendService.post<{
      authData?: AuthData,
      localeCode?: string,
      passwordNeedsToBeChanged?: boolean,
      person: UnifiedPerson,
      maxAttachmentSize: number,
    }>('/auth/login', credentials).pipe(
      map(response => {
        return {
          authData: {
            ...response.body.authData,
          },
          localisation: this.getLocalisation(response.body.localeCode),
          passwordNeedsToBeChanged: response.body.passwordNeedsToBeChanged,
          person: {
            ...response.body.person,
          },
          maxAttachmentSize: response.body.maxAttachmentSize,
        };
      }),
    );
  }

  public redirectAfterLogin(): void {
    this.authFacade.redirectTo
      .pipe(take(1))
      .subscribe(redirectTo => this.router.navigateByUrl(redirectTo));
  }

  public redirectToPasswordChangeRoute(): void {
    this.router.navigateByUrl('/login/change-password');
  }

  public changePassword(newPassword: string): Observable<undefined> {
    return this.authFacade.authUserData.pipe(
      take(1),
      switchMap(authData => this.appBackendService.post<undefined>('/auth/changePassword', {
          oldPassword: authData.password,
          newPassword: newPassword,
          userName: authData.userName,
          accountName: authData.accountName,
        }),
      ),
      map(response => response.body),
    );
  }

  public redirectAfterLogout(): void {
    this.router.navigateByUrl('/login');
  }

  public logout(): Observable<undefined> {
    return this.appBackendService.delete<undefined>('/auth/logout').pipe(
      map(response => response.body),
    );
  }

  private getLocalisation(localeCode: string): Localisation | undefined {
    if (!localeCode) {
      return undefined;
    }
    return findLocalisation(localeCode);
  }
}
