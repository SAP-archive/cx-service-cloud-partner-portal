import { Injectable, OnDestroy } from '@angular/core';
import { Credentials } from '../model/credentials.model';
import { Observable, of, Subject } from 'rxjs';
import { LoginData } from '../model/login-data.model';
import { Router } from '@angular/router';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';
import { AppBackendService } from '../../services/app-backend.service';
import { findLocalisation } from '../../components/localisation-selector/localisations';
import { AuthData } from '../model/auth-data.model';
import { UnifiedPerson } from '../../model/unified-person.model';
import { Localisation } from '../../components/localisation-selector/localisation';
import { AuthFacade } from '../state/auth/auth.facade';
import { ResetPasswordFacade } from '../state/resetPassword/reset-password.facade';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AuthService implements OnDestroy {
  private destroyed$: Subject<undefined> = new Subject();

  constructor(
    private router: Router,
    private authFacade: AuthFacade,
    private appBackendService: AppBackendService,
    private resetPasswordFacade: ResetPasswordFacade,
    private translateService: TranslateService) {
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
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
      switchMap(authData => {
        return this.appBackendService.post<undefined>('/auth/changePassword', {
          oldPassword: (authData.password ? authData.password : ''),
          newPassword: newPassword,
          userName: authData.userName,
          accountName: authData.accountName,
        });
      }),
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

  public getPartialEmailAddress(accountName: string, userName: string) {
    return this.appBackendService.post<{ maskedEmail: string }>(
      '/auth/resetPassword/userPartialEmailAddress', {
      userName,
      accountName,
    }).pipe(
      map(response => response.body),
    );
  }

  public sendVerificationCode(email: string) {
    return this.resetPasswordFacade.data$.pipe(take(1),
      mergeMap(data => {
        return this.appBackendService.post<undefined>(
          '/auth/resetPassword/sendVerificationCode', {
          userName: data.userName,
          accountName: data.accountName,
          user_email_address: email,
        });
      }));
  }

  public verifyVerificationCode(verificationCode: string) {
    return this.resetPasswordFacade.data$.pipe(take(1),
      mergeMap(data => {
        return this.appBackendService.post<{ verificationCode: string }>(
          '/auth/resetPassword/verifyVerificationCode', {
          userName: data.userName,
          accountName: data.accountName,
          user_email_address: data.email,
          verification_code: verificationCode,
        });
      }));
  }

  public resetPassword(newPassword: string) {
    return this.resetPasswordFacade.data$.pipe(take(1),
      mergeMap(data => {
        return this.appBackendService.post<{ verificationCode: string }>(
          '/auth/resetPassword', {
          userName: data.userName,
          accountName: data.accountName,
          password: newPassword,
          user_email_address: data.email,
          verification_code: data.verificationCode,
        });
      }));
  }

  private getLocalisation(localeCode: string): Localisation | undefined {
    if (!localeCode) {
      return undefined;
    }
    return findLocalisation(localeCode);
  }

  public getTranslatedPolicyError(policyError: string): Observable<string> {
    if (policyError.indexOf(': ') > -1) {
      const code = policyError.split(': ')[0];
      const message = policyError.split(': ')[1];
      return this.translateService.get(
        AuthService.mappingCodeToMessage(code),
        { dynamicValue: AuthService.getDynamicValue(message) }
      );
    } else {
      return of('UNEXPECTED_ERROR');
    }
  }

  private static mappingCodeToMessage(code: string): string {
    switch (code) {
      case '04':
        return 'PASSWORD_MUST_DIFFERENT_THAN_NAME';
      case '05':
        return 'PASSWORD_HISTORY_SIZE';
      case '06':
        return 'MIN_PASSWORD_LENGTH';
      case '07':
        return 'MIN_NUMBER_OF_DIGITS';
      case '08':
        return 'MIN_NUMBER_OF_LETTERS';
      case '09':
        return 'MIN_NUMBER_OF_LOWER_CASE_LETTERS';
      case '10':
        return 'MIN_NUMBER_OF_SPECIAL_CHARACTERS';
      case '11':
        return 'MIN_NUMBER_OF_UPPER_CASE_LETTERS';
      default:
        return 'UNEXPECTED_ERROR';
    }
  }

  private static getDynamicValue(message: string): string {
    const startIndex = message.indexOf('[');
    const endIndex = message.indexOf(']');
    if (startIndex > -1 && endIndex > startIndex) {
      return message.substring(startIndex + 1, endIndex);
    } else {
      return '';
    }
  }

}
