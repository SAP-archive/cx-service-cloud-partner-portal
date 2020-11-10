
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { first, mergeMap, map, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ResetPasswordData } from '../../../model/reset-password-data.model';
import { RequestError } from '../../../model/request-error.model';
import { ResetPasswordFacade } from '../../../state/resetPassword/reset-password.facade';

@Component({
  selector: 'reset-password-confirm-email',
  templateUrl: './reset-password.confirm-email.component.html',
  styleUrls: [
    './reset-password.confirm-email.component.scss'
  ]
})

export class ResetPasswordConfirmEmailComponent implements OnInit, OnDestroy {

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
  }

  public onSubmit() {
    if (!!this.data.email) {
      this.resetPasswordFacade.sendVerificationCode(this.data.email);
      this.resetPasswordFacade.isBusy$.pipe(
        first(isBusy => !isBusy),
        mergeMap(() => this.resetPasswordFacade.error$),
        first()
      )
        .subscribe(error => {
          if (!error) {
             this.router.navigate(['login', 'resetPassword', 'verifyCode']);
          }
        });
    }
  }

}
