
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject} from 'rxjs';
import { first, mergeMap, map, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ResetPasswordData } from '../../../model/reset-password-data.model';
import { RequestError } from '../../../model/request-error.model';
import { ResetPasswordFacade } from '../../../state/resetPassword/reset-password.facade';

@Component({
  selector: 'reset-password-resend-code',
  templateUrl: './reset-password.resend-code.component.html',
  styleUrls: [
    './reset-password.resend-code.component.scss'
  ]
})

export class ResetPasswordResendCodeComponent implements OnInit, OnDestroy {
  public data: Partial<ResetPasswordData> = {};
  public isBusy$: Observable<boolean> = this.resetPasswordFacade.isBusy$;
  public error$: Observable<RequestError | null>;
  private destroyed$ = new Subject<void>();

  constructor(
    private resetPasswordFacade: ResetPasswordFacade,
    private router: Router
  ) { }

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public ngOnInit() {
    this.resetPasswordFacade.resetError();
    this.resetPasswordFacade.data$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(data => {
      this.data = _.cloneDeep(data);
    });

    this.isBusy$ = this.resetPasswordFacade.isBusy$;
    this.error$ = this.resetPasswordFacade.error$.pipe(
      map(error => {
        if (error && error.code === -1) {
          this.router.navigate(['login']);
        }
        return error;
      })
    );

  }

  public onSubmit() {
    this.resetPasswordFacade.resendVerificationCode();
    this.resetPasswordFacade.isBusy$.pipe(
      first(isBusy => !isBusy),
      mergeMap(() => this.resetPasswordFacade.error$),
      first()
    ).subscribe(error => {
      if (!error) {
        this.router.navigate(['login', 'resetPassword', 'verifyCode']);
      }
    });
  }

}
