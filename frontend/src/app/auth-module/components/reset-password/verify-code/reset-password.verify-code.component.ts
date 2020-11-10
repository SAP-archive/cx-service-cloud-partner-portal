
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { first, mergeMap, map, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ResetPasswordData } from '../../../../auth-module/model/reset-password-data.model';
import { RequestError } from '../../../../auth-module/model/request-error.model';
import * as _ from 'lodash';
import { ResetPasswordFacade } from '../../../state/resetPassword/reset-password.facade';

@Component({
  selector: 'reset-password-verify-code',
  templateUrl: './reset-password.verify-code.component.html',
  styleUrls: [
    './reset-password.verify-code.component.scss'
  ]
})

export class ResetPasswordVerifyCodeComponent implements OnInit, OnDestroy {
  public data: Partial<ResetPasswordData>;
  public isBusy$: Observable<boolean>;
  public error$: Observable<RequestError | null>;
  private destroyed$ = new Subject<void>();

  constructor(
    private resetPasswordFacade: ResetPasswordFacade,
    private router: Router
  ) {
    this.data = {};
    this.isBusy$ = of(false);
  }

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public ngOnInit() {
    this.resetPasswordFacade.data$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(data => {
      this.data = _.cloneDeep(data);
    });

    this.isBusy$ = this.resetPasswordFacade.isBusy$;
    this.error$ = this.resetPasswordFacade.error$.pipe(
      map(error => {
        if (error && error.code === 404) {
          return {
            ...error,
            message: 'Wrong verification code'
          };
        } else if (error && error.code === -1) {
          this.router.navigate(['login']);
        }
        return error;
      })
    );
  }

  public onSubmit() {
    if (!!this.data.verificationCode) {
      this.resetPasswordFacade.verifyVerificationCode(this.data.verificationCode);

      this.resetPasswordFacade.isBusy$.pipe(
        first(isLoading => !isLoading),
        mergeMap(() => this.resetPasswordFacade.error$),
        first()
      )
        .subscribe(error => {
          if (!error) {
            this.router.navigate(['login', 'resetPassword', 'newPassword']);
          }
        });
    }
  }

  public codeNotReceived() {
    this.router.navigate(['login', 'resetPassword', 'resendCode']);
  }

}
