import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { mergeMap, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ResetPasswordFacade } from '../../state/resetPassword/reset-password.facade';

@Injectable()
export class ResetPasswordHasVerificationCodeGuard implements CanActivate {

  constructor(
    private resetPasswordFacade: ResetPasswordFacade,
    private router: Router
  ) {
  }

  public canActivate() {
    return this.resetPasswordFacade.data$
      .pipe(
        take(1),
        mergeMap((data): Observable<boolean | UrlTree> => {
          if (!!data && !!data.verificationCode) {
            return of(true);
          }
          return of(this.router.parseUrl('/login'));
        })
      );
  }

}
